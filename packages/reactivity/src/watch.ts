import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

// WeakMap 用来处理循环引用问题
function traversal(source, map = new WeakMap()) {
  // 递归结束条件：非对象
  if (!isObject(source)) return source;
  //   如果引用地址相同 代表存在循环引用 直接返回
  if (map.has(source)) return source;
  map.set(source, {});
  for (let key in source) {
    traversal(source[key], map);
  }
  return source;
}

export function watch(source, cb) {
  let getter;

  if (isReactive(source)) {
    getter = () => traversal(source);
  } else if (isFunction(source)) {
    getter = source;
  } else {
    return;
  }
  let oldValue, cleanup;
  const onCleanup = (fn) => {
    //   保存用户的函数
    cleanup = fn;
  };
  const scheduler = () => {
    //  下一次watch执行的时候开始触发上一次watch的fn
    cleanup && cleanup();
    const newValue = effect.run();
    cb(newValue, oldValue, onCleanup);
    oldValue = newValue;
  };
  const effect = new ReactiveEffect(getter, scheduler);
  oldValue = effect.run();
  return effect;
}
