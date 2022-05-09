import { isObject } from "@vue/shared";
import { reactive, ReactiveEffect } from ".";
import { trackEffects, triggerEffects } from "./effect";

function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

function isRef(r) {
  return !!(r && r.__v_isRef === true);
}

class RefImpl {
  private _value: any;
  private __v_isReadonly = true;
  private __v_isRef = true;
  public dep = new Set<ReactiveEffect>();
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    trackEffects(this.dep);
    return this._value;
  }
  set value(newValue) {
    if (newValue != this.rawValue) {
      this._value = toReactive(newValue);
      this.rawValue = newValue;
      triggerEffects(this.dep);
    }
  }
}

class ObjectRefImpl {
  constructor(public object, public key) {}
  //   将value属性代理到原始类型上
  get value() {
    return this.object[this.key];
  }
  set value(newValue) {
    this.object[this.key] = newValue;
  }
}

export function ref(value) {
  return new RefImpl(value);
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

export function toRefs(value) {
  const result = Array.isArray(value) ? new Array(value.length) : {};

  for (let key in value) {
    result[key] = toRef(value, key);
  }

  return result;
}

export function proxyRefs(object) {
  return new Proxy(object, {
    get(target, key, receiver) {
      const r = Reflect.get(target, key, receiver);
      return isRef(r) ? r.value : r;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (isRef(oldValue)) {
        oldValue.value = value;
        return true;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });
}
