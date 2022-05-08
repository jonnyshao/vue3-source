import { isFunction } from "@vue/shared";
import { ReactiveEffect, track, trackEffects, triggerEffects } from "./effect";

class ComputedRefImpl {
  public effect: ReactiveEffect;
  private _dirty = true; // 默认取值的时候进行计算
  private __v_isReadonly = true;
  private __v_isRef = true;
  private _value;
  public dep = new Set<ReactiveEffect>();
  constructor(public getter, public setter) {
    //   将用户写的getter放入effect中，里面的属性会被当前的effect收集起来

    this.effect = new ReactiveEffect(getter, () => {
      // 稍后依赖的属性变化会执行此调度函数  /*scheduler*/
      if (!this._dirty) {
        //   脏值重新设置为true 缓存需要
        this._dirty = true;
        //  触发effects=>更新视图
        triggerEffects(this.dep);
      }
    });
  }
  get value() {
    // 取值前做依赖收集
    trackEffects(this.dep);
    //   首次取值标记为脏值
    if (this._dirty) {
      // 取完值后脏值改为false=>实现缓存，待用户触发setter的时候再改变脏值
      this._dirty = false;
      this._value = this.effect.run();
    }

    return this._value;
  }

  set value(newValue) {
    this.setter(newValue);
  }
}

export const computed = (getterOrOptions: any) => {
  let onlyGetter = isFunction(getterOrOptions);
  let getter, setter;

  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
};
