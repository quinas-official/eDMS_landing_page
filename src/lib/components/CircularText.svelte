<script lang="ts">
	import { onMount } from 'svelte';

	type HoverMode = 'slowDown' | 'speedUp' | 'pause' | 'goBonkers' | null;

	let {
		text,
		spinDuration = 20,
		onHover = 'speedUp',
		size = 200,
		class: className = ''
	}: {
		text: string;
		spinDuration?: number;
		onHover?: HoverMode;
		size?: number;
		class?: string;
	} = $props();

	const letters = $derived(Array.from(text));
	const fontSize = $derived(Math.round(size * 0.12));

	let rotation = $state(0);
	let hovered = $state(false);

	// Seconds per revolution while hovered, per mode (Infinity = paused).
	const hoverDuration = $derived.by(() => {
		switch (onHover) {
			case 'slowDown':
				return spinDuration * 2;
			case 'speedUp':
				return spinDuration / 4;
			case 'pause':
				return Infinity;
			case 'goBonkers':
				return spinDuration / 20;
			default:
				return spinDuration;
		}
	});
	const scale = $derived(hovered && onHover === 'goBonkers' ? 0.8 : 1);

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let speed = 360 / spinDuration; // deg per second
		let last = performance.now();
		let frame: number;

		const tick = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.1);
			last = now;
			const duration = hovered ? hoverDuration : spinDuration;
			const target = Number.isFinite(duration) ? 360 / duration : 0;
			// Ease speed toward target so mode changes feel springy rather than abrupt.
			speed += (target - speed) * Math.min(dt * 6, 1);
			rotation = (rotation + speed * dt) % 360;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	class="circular-text {className}"
	style:width="{size}px"
	style:height="{size}px"
	style:font-size="{fontSize}px"
	style:rotate="{rotation}deg"
	style:scale={scale}
	role="img"
	aria-label={text}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	{#each letters as letter, i (i)}
		<span aria-hidden="true" style:transform="rotateZ({(360 / letters.length) * i}deg)">{letter}</span>
	{/each}
</div>

<style>
	.circular-text {
		position: relative;
		margin: 0 auto;
		border-radius: 50%;
		font-weight: 900;
		text-align: center;
		cursor: pointer;
		transform-origin: 50% 50%;
		transition: scale 0.3s ease;
	}

	.circular-text span {
		position: absolute;
		inset: 0;
		display: inline-block;
		transition: all 0.5s cubic-bezier(0, 0, 0, 1);
	}
</style>
