<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { QUINAS_URL } from '$lib/brand';
	import Logo from './Logo.svelte';
	import CircularText from './CircularText.svelte';
</script>

<footer class="border-t border-neutral-200 dark:border-neutral-800">
	<!-- Maker credit -->
	<div class="border-b border-neutral-200 bg-neutral-950 text-white dark:border-neutral-800">
		<div class="container-page flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left">
			<div>
				<p class="text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">A product by</p>
				<a
					href={QUINAS_URL}
					target="_blank"
					rel="noopener"
					class="mt-1 inline-block text-2xl font-bold tracking-[0.25em] transition hover:text-neutral-300"
				>
					QUINAS
				</a>
				<p class="mt-1 text-sm text-neutral-400">Systems Engineered With Intent.</p>
			</div>
			<CircularText text="MADE*BY*QUINAS*" onHover="speedUp" spinDuration={20} size={120} class="text-white" />
			<a
				href={QUINAS_URL}
				target="_blank"
				rel="noopener"
				class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-900"
			>
				Visit QUINAS <ArrowUpRight class="size-4" />
			</a>
		</div>
	</div>

	<div class="container-page flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
		<div class="flex flex-col items-center gap-2 sm:items-start">
			<Logo />
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Enterprise Document Management System for your LAN.</p>
		</div>
		<ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
			<li><a class="hover:text-neutral-900 dark:hover:text-white" href="#features">Features</a></li>
			<li><a class="hover:text-neutral-900 dark:hover:text-white" href="#history">Version history</a></li>
			<li><a class="hover:text-neutral-900 dark:hover:text-white" href="#architecture">Architecture</a></li>
			<li><a class="hover:text-neutral-900 dark:hover:text-white" href="#get-started">Get started</a></li>
			<li><a class="hover:text-neutral-900 dark:hover:text-white" href="#roadmap">Roadmap</a></li>
			<li><a class="hover:text-neutral-900 dark:hover:text-white" href="#updates">Updates</a></li>
		</ul>
	</div>
	<p class="container-page pb-10 text-center text-xs text-neutral-400 sm:text-left">
		© {new Date().getFullYear()} QUINAS. Built with SvelteKit, Svelte 5 and TailwindCSS.
	</p>
</footer>
