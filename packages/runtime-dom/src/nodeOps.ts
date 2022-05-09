//  增加 删除 修改 查询

export const nodeOps = {
  insert(child, parent: HTMLElement, anchor = null) {
    parent.insertBefore(child, anchor); // anchor为null的话 等价于 appendChild
  },
  remove(child: HTMLElement) {
    const parentNode = child.parentNode;
    if (parentNode) {
      parentNode.removeChild(child);
    }
  },
  // 元素文本设置
  setElementText(el: HTMLElement, text) {
    el.textContent = text;
  },
  // 文本节点
  setText(node: HTMLElement, text) {
    node.nodeValue = text;
  },
  querySelector(selector) {
    return document.querySelector(selector);
  },
  parentNode(node) {
    return node.parentNode;
  },
  nextSibling(node) {
    return node.nextSibling;
  },
  createElement(tagName) {
    return document.createElement(tagName);
  },
  createText(text) {
    return document.createTextNode(text);
  },
};
