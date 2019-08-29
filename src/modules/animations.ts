/**
 * Expands element from it's parent to outer wrapper.
 * Assumptions: non-expanded element fits parent's size, expanded element fits wrapper's size.
 *
 * Resizing is based on switching element's positioning to absolute,
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
 * There are 2 CSS classes which is used here for animation: 'expand' and 'expanded'.
 *
 * .expand is created by this function, it changes element's positioning to absolute,
 * and initializes left, top, right and bottom attributes to values,
 * that correspond to element's location (relative to wrapper) at the beginning of animation.
 *
 * .expanded should be defined outside, should set coordinate attributes to 0,
 * and should have higher priority then .expand (because they both race for the same attributes),
 * so it should be combined with class for which it is used:
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
export function expandView(el: HTMLElement, wrapper: HTMLElement, duration: number) {
  const expand = 'expand';
  const expanded = 'expanded';
  const innerRect = el.parentElement!.getBoundingClientRect();
  const outerRect = wrapper.getBoundingClientRect();

  let style = document.getElementById(expand) as HTMLStyleElement;
  if (!style) {
    style = document.createElement('style');
    style.id = expand;
    document.head.appendChild(style);
  }

  style.innerHTML = `
  .${expand} {
    position: absolute;
    z-index: 1;
    left: ${innerRect.left - outerRect.left}px;
    top: ${innerRect.top - outerRect.top}px;
    right: ${outerRect.right - innerRect.right}px;
    bottom: ${outerRect.bottom - innerRect.bottom}px;
    transition: all ${duration}s;
  }`;

  if (!el.classList.contains(expand)) {
    el.classList.add(expand);
  }

  return new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      el.classList.toggle(expanded);
      const transitionEnd = (e: TransitionEvent) => {
        const el = e.target as HTMLElement;
        el.removeEventListener('transitionend', transitionEnd);
        if (!el.classList.contains(expanded)) {
          el.classList.remove(expand);
        }
        resolve();
      };
      el.addEventListener('transitionend', transitionEnd);
    });
  });
}
