/**
 * Expands element from it's parent boundaries to outer wrapper boundaries.
 * Assumptions: non-expanded element fits parent's size, expanded element fits wrapper's size.
 *
 * Resizing does not move element in document tree, it is based on switching element's positioning to absolute,
 * so there are additional assumptions that must be met:
 * - element and parent should belong to wrapper's sub-tree;
 * - wrapper should have any non-default positioning (position: fixed/absolute/relative);
 * - on the tree path from element's parent to wrapper there should not be elements with non-default positioning;
 * - element should not have absolute or fixed positioning (only default and relative is allowed).
 *
 * How it works:
 * When element's positioning is changed from initial to absolute,
 * it's location becomes based on wrapper's location instead of parent's.
 * This allows us to use animated CSS transition for element.
 *
 * There are 2 CSS classes which is used here for animation: 'resizing' and 'expanded'.
 *
 * .resizing is created by this function, it changes element's positioning to absolute,
 * and initializes left, top, right and bottom attributes to values,
 * that correspond to element's parent location (relative to wrapper) at the beginning of animation.
 *
 * .expanded should be defined outside, should have coordinate attributes set to 0 (left, top, right, bottom),
 * and should have higher priority then .resizing (because they both race for the coordinate attributes),
 * so it should be additionally combined with class for which it is applied:
 * .some-view.expanded {
 *   left: 0;
 *   top: 0;
 *   right: 0;
 *   bottom: 0;
 * }
 * This will provide element's fit to wrapper at the end of animation.
 * Non-zero values are also allowed, in this case element will not completely fit into wrapper, and will have some margins.
 *
 * @param el element to expand.
 * @param wrapper outer element.
 * @param duration expansion animation duration, in seconds.
 * @returns promise, that will be resolved when animation will be completed.
 */
export function toggleExpanded(el: HTMLElement, wrapper: HTMLElement, duration: number) {
  const resizing = 'resizing';
  const expanded = 'expanded';
  const innerRect = el.parentElement!.getBoundingClientRect();
  const outerRect = wrapper.getBoundingClientRect();

  let style = document.getElementById(resizing) as HTMLStyleElement;
  if (!style) {
    style = document.createElement('style');
    style.id = resizing;
    document.head.appendChild(style);
  }

  style.innerHTML = `
  .${resizing} {
    position: absolute;
    z-index: 1;
    left: ${innerRect.left - outerRect.left}px;
    top: ${innerRect.top - outerRect.top}px;
    right: ${outerRect.right - innerRect.right}px;
    bottom: ${outerRect.bottom - innerRect.bottom}px;
    transition: all ${duration.toFixed(1)}s;
  }`;

  return new Promise<void>(resolve => {
    // adding both .resizing and .expanded in the same frame will not trigger the animation
    requestAnimationFrame(() => {
      el.classList.add(resizing);
      requestAnimationFrame(() => {
        const transitionEnd = (e: TransitionEvent) => {
          const el = e.target as HTMLElement;
          el.removeEventListener('transitionend', transitionEnd);
          el.classList.remove(resizing);
          resolve();
        };
        el.classList.toggle(expanded);
        el.addEventListener('transitionend', transitionEnd);
      });
    });
  });
}
