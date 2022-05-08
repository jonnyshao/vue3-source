import { isObject } from "@vue/shared";

import { activeEffect, track, trigger } from "./effect";
import { ReactiveFlags, reactive } from "./reactive";

export const mutableHandlers = {
  get(target, key, receiver) {
    if (key == ReactiveFlags.IS_REACTIVE) return true;
    track(target, "get", key);
    const result = Reflect.get(target, key, receiver);
    if (isObject(result)) {
      return reactive(result);
    }
    return result;
  },
  set(target, key, newValue, receiver) {
    let oldValue = target[key];
    const result = Reflect.set(target, key, newValue, receiver);
    if (oldValue !== newValue) {
      trigger(target, "set", key, newValue, oldValue);
    }
    return result;
  },
};
