/**
 * HTMLElement.addEventListener wrapper.
 * @param type event type.
 * @param handler event handler.
 * @param options event options.
 * @returns function that will remove handler when called.
 */
export function onElementEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
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
export function onWindowEvent<K extends keyof WindowEventMap>(type: K, handler: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
  window.addEventListener(type, handler, options);
  return () => window.removeEventListener(type, handler, options);
}

/**
 * Allows to use event offset coordinates relative to event current target.
 * Note: e.offsetX and e.offsetY works differently in Firefox (relative to e.target) and Chrome (relative to e.currentTarget).
 * @param e event.
 * @returns event coordinates offset relative to event's currentTarget.
 */
export function currentTargetOffset(e: MouseEvent): [number, number] {
  const rect = (e.currentTarget as Element).getBoundingClientRect();
  return [e.clientX - rect.left, e.clientY - rect.top];
}

export function elementOffset(el: Element, e: MouseEvent): { x: number, y: number } {
  const rect = el.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
