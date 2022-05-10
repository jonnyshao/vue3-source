import { isString, ShapeFlags } from "@vue/shared";

export function isVNode(value) {
  return !!value?.__v_isVnode;
}

export function createVNode(type, props, children = null) {
  let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
  const vnode = {
    __v_isVnode: true,
    shapeFlag,
    type,
    props,
    key: props?.["key"],
    children,
    el: null, // 虚拟节点对应的真实节点
  };
  if (children) {
    if (Array.isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN;
    } else {
      type = ShapeFlags.TEXT_CHILDREN;
      children = String(children);
    }
    vnode.shapeFlag |= type;
  }

  return vnode;
}
