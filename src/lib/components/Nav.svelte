<script lang="ts">
	import { Menu, X } from '@lucide/svelte';
	import { QUINAS_URL } from '$lib/brand';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '#features', label: 'Features' },
		{ href: '#history', label: 'History' },
		{ href: '#workflow', label: 'Workflow' },
		{ href: '#architecture', label: 'Architecture' },
		{ href: '#security', label: 'Security' },
		{ href: '#roadmap', label: 'Roadmap' }
	];
	// "Get started" is the header button on wide screens, so it only appears as a link in the mobile menu.
	const mobileLinks = [...links, { href: '#get-started', label: 'Get started' }];

	let open = $state(false);
	let scrolled = $state(false);
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 8)} />

<header
	class="fixed inset-x-0 top-0 z-50 border-b transition-colors {scrolled || open
		? 'border-neutral-200 bg-white/85 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/85'
		: 'border-transparent'}"
>
	<nav class="container-page flex h-16 items-center justify-between gap-6">
		<div class="flex shrink-0 items-center gap-3">
			<Logo />
			<a
				href={QUINAS_URL}
				target="_blank"
				rel="noopener"
				class="hidden border-l border-neutral-200 pl-3 text-[11px] leading-none font-medium tracking-wide whitespace-nowrap text-neutral-400 uppercase transition hover:text-neutral-900 xl:inline dark:border-neutral-800 dark:hover:text-white"
			>
				by <span class="tracking-[0.2em]">QUINAS</span>
			</a>
		</div>

		<ul class="hidden items-center lg:flex">
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						class="rounded-md px-2.5 py-2 text-sm font-medium whitespace-nowrap text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="flex shrink-0 items-center gap-2">
			<div class="hidden sm:block"><ThemeToggle /></div>
			<a
				href="#get-started"
				class="hidden h-9 items-center rounded-lg bg-neutral-950 px-4 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-neutral-800 sm:inline-flex dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
			>
				Get started
			</a>
			<button
				type="button"
				class="grid size-9 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 lg:hidden dark:text-neutral-300 dark:hover:bg-neutral-800"
				aria-label={open ? 'Close menu' : 'Open menu'}
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				{#if open}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
			</button>
		</div>
	</nav>

	{#if open}
		<ul class="container-page flex flex-col gap-1 pb-4 lg:hidden">
			{#each mobileLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						onclick={() => (open = false)}
						class="block rounded-md px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li class="mt-2 border-t border-neutral-200 px-3 pt-4 dark:border-neutral-800">
				<p class="mb-2 text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">Theme</p>
				<ThemeToggle showLabels />
			</li>
		</ul>
	{/if}
</header>
