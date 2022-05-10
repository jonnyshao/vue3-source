import { ShapeFlags } from "@vue/shared";

export function createRenderer(renderOptions) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,

    setText: hostSetText,
    querySelector: hostQuerySelector,
    parentNode: hostParent,
    nextSibling: hostNextSibling,
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp,
  } = renderOptions;

  function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  }

  function mountElement(vnode, container) {
    let { type, props, children, shapeFlag } = vnode;
    //   将真实dome挂载到虚拟节点，dom diff会复用
    let el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (let key in props) {
        if (props.hasOwn(key)) {
          hostPatchProp(el, key, null, props[key]);
        }
      }
    }
    // 文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(children);
      //   数组
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
  }
  function patch(vn1, vn2, container) {
    if (vn1 == vn2) return;
    if (vn1 == null) {
      mountElement(vn1, container);
    }
  }
  function render(vnode, container) {
    //   卸载逻辑
    if (vnode == null) {
    } else {
      // 初始化或更新
      patch(container._vnode || null, vnode, container);
      container._vnode = vnode;
    }
  }
  return {
    render,
  };
}
