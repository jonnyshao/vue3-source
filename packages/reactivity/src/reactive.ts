import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";


export enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive'
}

const reactiveMap = new WeakMap()
// 将数据转化响应式的数据
export function reactive(target){
    if (!isObject(target)) return target
    // 如果是个代理对象
    if(target[ReactiveFlags.IS_REACTIVE]) return target
    // 如果之前已经被代理过
    if(reactiveMap.has(target)) return reactiveMap.get(target)
    const proxy = new Proxy(target,mutableHandlers)
    reactiveMap.set(target, proxy)
    return proxy
}
