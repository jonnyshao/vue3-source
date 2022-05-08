export let activeEffect: ReactiveEffect = null as ReactiveEffect;
export class ReactiveEffect {
  public active = true; // 这个effect 默认是激活状态
  public parent = null;
  public deps = [];
  constructor(public fn, public scheduler) {}
  run() {
    if (!this.active && this.fn) {
      // active 为false时，不需要进行依赖收集
      return this.fn();
    }
    // 开始依赖收集=>将当前的effect 和稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect;
      activeEffect = this;
      // 这里我们需要在执行用户函数之前将之前收集的内容清空 activeEffect.deps = [(set),(set)]
      cleanupEffect(this);
      return this.fn(); // 稍后调用取值操作的时候 就可以获取到这个全局的activeEffect了
    } catch (error) {
      console.error(error);
    } finally {
      activeEffect = this.parent;
      this.parent = null;
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      cleanupEffect(this); // 停止effect的收集
    }
  }
}
// 副作作用函数
/**
 *
 * 每一个属性对应多个effects,
 * 每一个effects对应多个属性
 */
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler); // 创建响应式的effect
  // 默认先执行一次
  _effect.run();

  const runner = _effect.run.bind(_effect);
  runner.effect = _effect; // 将effect 挂载到runner对象上
  return runner;
}
// 源对象缓存
const targetMap = new WeakMap<object, Map<string, Set<ReactiveEffect>>>();

// 依赖收集
export function track(target, type, key) {
  // weakMap = {object:Map:{key:Set}}
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  console.log(key);
  trackEffects(dep);
  //   let shouldTrack = !dep.has(activeEffect);
  //   // 属性记录了effect,应该让effect也记录它被哪些属性收集过
  //   if (shouldTrack) {
  //     dep.add(activeEffect);
  //     // 让effect记录对应的dep 稍后清理的时候会用到
  //     activeEffect.deps.push(dep);
  //   }
}
// 收集effects
export function trackEffects(dep) {
  console.log(activeEffect);
  if (!activeEffect) return;
  let shouldTrack = !dep.has(activeEffect);
  // 属性记录了effect,应该让effect也记录它被哪些属性收集过
  if (shouldTrack) {
    dep.add(activeEffect);
    // 让effect记录对应的dep 稍后清理的时候会用到
    activeEffect.deps.push(dep);
  }
}
// 触发setter
export function trigger(target, type, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  // 修改的值不在模板中
  if (!depsMap) return;
  let effects = depsMap.get(key);
  if (effects) {
    triggerEffects(effects);
  }
}
// 触发effects
export function triggerEffects(effects) {
  // copy一份 避免清除的时候产生死循环
  effects = new Set<ReactiveEffect>(effects);
  effects.forEach((effect) => {
    // 如果同一个effect回调在执行时 修改了变量值，会再次执行造成递归，第一次执行和更新执行不能是同一个

    if (effect !== activeEffect) {
      effect.scheduler ? effect.scheduler() : effect.run();
    }
  });
}
// 清除effects
function cleanupEffect(effect) {
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect); // 删除每个set中的effect
  }
  effect.deps.length = 0;
}
