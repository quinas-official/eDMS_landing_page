<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/actions/reveal';

	let {
		eyebrow,
		title,
		children
	}: { eyebrow: string; title: string; children?: Snippet } = $props();
</script>

<div use:reveal class="mx-auto max-w-2xl text-center">
	<p class="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{eyebrow}</p>
	<h2 class="mt-3 text-3xl font-bold tracking-tight text-balance text-neutral-900 sm:text-4xl dark:text-white">
		{title}
	</h2>
	{#if children}
		<p class="mt-4 text-lg text-pretty text-neutral-600 dark:text-neutral-400">{@render children()}</p>
	{/if}
</div>
