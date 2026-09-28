<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { prefersReducedMotion } from '$lib/actions/reveal';

	let {
		words,
		typeMs = 70,
		deleteMs = 35,
		holdMs = 2200,
		class: className = ''
	}: { words: string[]; typeMs?: number; deleteMs?: number; holdMs?: number; class?: string } =
		$props();

	// Server render shows the first phrase in full, so the headline reads correctly before JS runs.
	let index = $state(0);
	let text = $state(untrack(() => words[0]));

	onMount(() => {
		if (prefersReducedMotion() || words.length < 2) return;

		let timer: ReturnType<typeof setTimeout>;
		let deleting = true;

		const tick = () => {
			const word = words[index];
			if (deleting) {
				text = word.slice(0, text.length - 1);
				if (text.length === 0) {
					deleting = false;
					index = (index + 1) % words.length;
				}
				timer = setTimeout(tick, deleteMs);
			} else {
				text = word.slice(0, text.length + 1);
				if (text === word) {
					deleting = true;
					timer = setTimeout(tick, holdMs);
				} else {
					timer = setTimeout(tick, typeMs + Math.random() * 40);
				}
			}
		};

		timer = setTimeout(tick, holdMs);
		return () => clearTimeout(timer);
	});
</script>

<!-- Screen readers get every phrase once instead of a stream of partial words. -->
<span class="sr-only">{words.join(', ')}</span>
<span class={className} aria-hidden="true"
	>{text}<span
		class="caret ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] rounded-full bg-current align-baseline"
	></span></span
>
