import type { Action } from 'svelte/action';

export type RevealOptions = {
	/** Delay before the fade-in starts, in ms. Useful for staggering items in a grid. */
	delay?: number;
	/** Called once, the first time the element enters the viewport. */
	onenter?: () => void;
	/** Called instead of `onenter` when the element was already scrolled past on load. */
	onskip?: () => void;
};

/**
 * Fades an element in the first time it scrolls into view. Once seen it stays visible,
 * so scrolling back up doesn't replay the animation.
 * Styles live in app.css under `.reveal`; without JavaScript the content stays visible.
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	let opts = options;

	node.classList.add('reveal');
	node.style.setProperty('--reveal-delay', `${opts.delay ?? 0}ms`);

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) {
				// Already scrolled past (reload mid-page, or a #link jump): show it without animating.
				if (entry.boundingClientRect.bottom < 0) {
					node.classList.add('reveal-instant', 'is-visible');
					observer.disconnect();
					opts.onskip?.();
				}
				return;
			}
			node.classList.add('is-visible');
			observer.disconnect();
			opts.onenter?.();
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);
	observer.observe(node);

	return {
		update(next = {}) {
			opts = next;
			node.style.setProperty('--reveal-delay', `${opts.delay ?? 0}ms`);
		},
		destroy() {
			observer.disconnect();
		}
	};
};

export const prefersReducedMotion = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
