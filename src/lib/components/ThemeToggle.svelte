<script lang="ts">
	import { Moon, Sun, Monitor } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { theme, initTheme, setTheme, type ThemeChoice } from '$lib/theme.svelte';

	let { showLabels = false }: { showLabels?: boolean } = $props();

	const options: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
		{ value: 'light', label: 'Light', icon: Sun },
		{ value: 'dark', label: 'Dark', icon: Moon },
		{ value: 'system', label: 'System', icon: Monitor }
	];

	onMount(initTheme);
</script>

<div
	role="radiogroup"
	aria-label="Color theme"
	class="flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-neutral-100/70 p-0.5 dark:border-neutral-800 dark:bg-neutral-900/70"
>
	{#each options as opt (opt.value)}
		{@const active = theme.choice === opt.value}
		<button
			type="button"
			role="radio"
			aria-checked={active}
			aria-label={opt.label}
			title={opt.label}
			onclick={() => setTheme(opt.value)}
			class="flex items-center gap-1.5 rounded-md text-xs font-medium transition {showLabels
				? 'flex-1 justify-center px-3 py-1.5'
				: 'size-7 justify-center'} {active
				? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white'
				: 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}"
		>
			<opt.icon class="size-3.5" />
			{#if showLabels}{opt.label}{/if}
		</button>
	{/each}
</div>
