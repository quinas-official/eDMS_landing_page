<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<a
	href="#top"
	class="flex shrink-0 items-center gap-2.5 font-semibold whitespace-nowrap text-neutral-950 dark:text-white {className}"
>
	<!-- Same artwork as static/logo.svg; inverts in dark mode so the tile stays visible. -->
	<svg viewBox="0 0 64 64" class="size-8" aria-hidden="true">
		<rect width="64" height="64" rx="14" class="fill-neutral-950 dark:fill-white" />
		<rect x="23" y="11" width="26" height="34" rx="3" class="fill-white dark:fill-neutral-950" fill-opacity="0.35" />
		<path
			d="M18 18h15l8 8v23a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V21a3 3 0 0 1 3-3Z"
			class="fill-white dark:fill-neutral-950"
		/>
		<path d="M33 18v6a2 2 0 0 0 2 2h6Z" class="fill-neutral-300 dark:fill-neutral-600" />
		<path
			d="M21.5 38.5l4.5 4.5 9-9.5"
			fill="none"
			class="stroke-neutral-950 dark:stroke-white"
			stroke-width="3.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	<span class="text-lg tracking-tight">eDMS</span>
</a>
