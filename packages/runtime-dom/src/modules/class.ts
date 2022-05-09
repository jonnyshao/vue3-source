export function patchClass(el: HTMLElement, className) {
  if (className == null) {
    el.removeAttribute(className);
  } else {
    el.className = className;
  }
}
