function createInvoker(cb) {
  // 换绑操作
  const invoker = (e) => invoker.value(e);
  invoker.value = cb;
  return invoker;
}

export function patchEvent(
  el: HTMLElement & { _vei?: Record<string, any> },
  eventName,
  nextValue
) {
  let invokers = (el._vei ||= {});
  let exits = invokers[eventName];
  if (exits && nextValue) {
    exits.value = nextValue;
  } else {
    let event = eventName.slice(2).toLowerCase();
    if (nextValue) {
      const invoker = (invokers[eventName] = createInvoker(nextValue));
      el.addEventListener(event, invoker);
    } else if (exits) {
      // 如果有上一次值的，移除上一次绑定的事件
      el.removeEventListener(event, exits);
      invokers[eventName] = undefined;
    }
  }
}
