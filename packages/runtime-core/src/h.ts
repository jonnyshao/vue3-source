/**
 * h的用法
 * h('div')
 * h('div',{style:{color:'red'}})
 * h('div',{style:{color:'red'}},'hello')
 * h('div','hello')
 * h('div',null,'hello')
 * h('div','hello','world')
 * h('div',null,h('span'))
 * h('div',[h('span')])
 */

import { isObject, isArray } from "@vue/shared";
import { createVNode, isVNode } from "./vnode";

export function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    // 是对象但不是数组
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // 如果是个vnode
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      // 属性
      return createVNode(type, propsOrChildren);
    } else {
      // 数组或文本
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      // 取出所有children
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      // children 包装一下
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
