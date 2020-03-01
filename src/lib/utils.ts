/**
 * HTMLElement.addEventListener wrapper.
 * @param type event type.
 * @param handler event handler.
 * @param options event options.
 * @returns function that will remove handler when called.
 */
export function onElementEvent<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  type: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  el.addEventListener(type, handler, options);
  return () => el.removeEventListener(type, handler, options);
}

/**
 * Window.addEventListener wrapper.
 * @param type event type.
 * @param handler event handler.
 * @param options event options.
 * @returns function that will remove handler when called.
 */
export function onWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  window.addEventListener(type, handler, options);
  return () => window.removeEventListener(type, handler, options);
}

/**
 * Returns coordinates of MouseEvent (clientX, clientY) relative to given element.
 * @param el element.
 * @param e event.
 * @returns coordinates as { x, y }.
 */
export function elementOffset(el: Element, e: MouseEvent): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

/**
 * Calls given callback every animation frame.
 * @param callback callback to call.
 * @param fireImmediately if true then additionally immediately calls callback.
 * @returns function that should be called to stop per-frame calls.
 */
export function onAnimationFrame(callback: () => void, fireImmediately = true) {
  let handle = 0;
  const frameHandler = () => {
    handle = window.requestAnimationFrame(frameHandler);
    callback();
  };
  if (fireImmediately) {
    callback();
  }
  handle = window.requestAnimationFrame(frameHandler);
  return () => window.cancelAnimationFrame(handle);
}
