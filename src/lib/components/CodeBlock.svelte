<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Check, Copy } from '@lucide/svelte';
	import { reveal, prefersReducedMotion } from '$lib/actions/reveal';

	let {
		title,
		lines,
		delay = 0
	}: { title: string; lines: { cmd: string; comment?: string }[]; delay?: number } = $props();

	// Each line "costs" its length plus a short pause, so typing hesitates between commands.
	const PAUSE = 10;
	const starts = $derived(
		lines.reduce<number[]>((acc, l, i) => [...acc, i === 0 ? 0 : acc[i - 1] + lines[i - 1].cmd.length + PAUSE], [])
	);
	const total = $derived(starts[lines.length - 1] + lines[lines.length - 1].cmd.length);

	// Full text on the server and with reduced motion; typed out otherwise.
	let tick = $state(Infinity);
	let timer: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		if (!prefersReducedMotion()) tick = 0;
	});
	onDestroy(() => clearInterval(timer));

	function startTyping() {
		if (tick !== 0) return;
		setTimeout(() => {
			timer = setInterval(() => {
				tick += 1;
				if (tick >= total) clearInterval(timer);
			}, 32);
		}, delay + 400);
	}

	const visible = (i: number) => Math.max(0, Math.min(lines[i].cmd.length, tick - starts[i]));
	const activeLine = $derived(tick >= total ? -1 : starts.findLastIndex((s) => tick >= s));

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(lines.map((l) => l.cmd).join('\n'));
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// Clipboard access can be denied; nothing else to do.
		}
	}
</script>

<div
	use:reveal={{ delay, onenter: startTyping, onskip: () => (tick = Infinity) }}
	class="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-lg dark:bg-neutral-900/80"
>
	<div class="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
		<p class="text-xs font-medium text-neutral-400">{title}</p>
		<button
			type="button"
			onclick={copy}
			class="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
			aria-label="Copy commands"
		>
			{#if copied}<Check class="size-3.5" /> Copied{:else}<Copy class="size-3.5" /> Copy{/if}
		</button>
	</div>
	<!-- The full commands are always in the accessibility tree; the typed copy is visual only. -->
	<pre class="sr-only">{lines.map((l) => l.cmd).join('\n')}</pre>
	<pre aria-hidden="true" class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed"><code
			>{#each lines as line, i (i)}<span class="text-neutral-500 select-none {i === 0 || tick >= starts[i] ? '' : 'invisible'}"
					>$ </span
				><span class="text-neutral-100">{line.cmd.slice(0, visible(i))}</span
				>{#if activeLine === i}<span class="caret inline-block h-[1.1em] w-1.75 translate-y-[0.2em] bg-neutral-300"></span
					>{/if}{#if line.comment && visible(i) === line.cmd.length}<span class="text-neutral-500"
						>  # {line.comment}</span
					>{/if}{'\n'}{/each}</code
		></pre>
</div>
