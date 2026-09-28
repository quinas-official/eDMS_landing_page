<script lang="ts">
	import { ArrowRight, Monitor, Globe, Network, Server, History } from '@lucide/svelte';
	import { reveal } from '$lib/actions/reveal';
	import AppMockup from './AppMockup.svelte';
	import Typewriter from './Typewriter.svelte';
	import Dither from './Dither.svelte';

	// Follow the `dark` class on <html> (set by theme.svelte.ts) so the shader colors match the page.
	let dark = $state(false);
	$effect(() => {
		const root = document.documentElement;
		const sync = () => (dark = root.classList.contains('dark'));
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(root, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	});
</script>

<section id="top" class="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
	<!-- Fades out toward the bottom so the hero blends into the next section. -->
	<div
		class="absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,black_40%,transparent_85%)] dark:opacity-60"
	>
		<Dither
			waveColor={dark ? [0.5, 0.5, 0.5] : [0.55, 0.55, 0.55]}
			backgroundColor={dark ? [0.04, 0.04, 0.04] : [1, 1, 1]}
			colorNum={4}
			waveAmplitude={0.3}
			waveFrequency={3}
			waveSpeed={0.05}
			mouseRadius={0.3}
		/>
	</div>

	<div class="container-page text-center">
		<a
			use:reveal
			href="#roadmap"
			class="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300"
		>
			<span class="size-1.5 rounded-full bg-neutral-950 dark:bg-white"></span>
			Backend on SQLite is live · desktop app in progress
			<ArrowRight class="size-3" />
		</a>

		<h1
			use:reveal={{ delay: 100 }}
			class="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-balance text-neutral-900 sm:text-6xl dark:text-white"
		>
			Your organization's documents,
			<!-- Fixed height so the page doesn't jump while phrases are typed and deleted. -->
			<span class="block min-h-[2.4em] sm:min-h-[1.2em]">
				<Typewriter
					class="text-neutral-400 dark:text-neutral-500"
					words={['on your own network.', 'versioned, every time.', 'properly approved.', 'on the record.']}
				/>
			</span>
		</h1>

		<p
			use:reveal={{ delay: 200 }}
			class="mx-auto mt-6 max-w-2xl text-lg text-pretty text-neutral-600 dark:text-neutral-400"
		>
			eDMS is a self-hosted document management system for the office LAN. Upload files, keep every
			version, move them through an approval workflow, and get an append-only audit trail of every
			action, with access scoped by role and department.
		</p>

		<div use:reveal={{ delay: 300 }} class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="#get-started"
				class="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus-visible:outline-white"
			>
				<Server class="size-4" />
				Set up a server
				<ArrowRight class="size-4" />
			</a>
			<a
				href="#history"
				class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
			>
				<History class="size-4" />
				See version history
			</a>
		</div>

		<ul
			use:reveal={{ delay: 400 }}
			class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400"
		>
			<li class="flex items-center gap-1.5"><Network class="size-4" /> Runs entirely on your LAN</li>
			<li class="flex items-center gap-1.5"><Globe class="size-4" /> Web app</li>
			<li class="flex items-center gap-1.5"><Monitor class="size-4" /> Desktop app (Tauri 2)</li>
		</ul>

		<div use:reveal={{ delay: 500 }} class="relative mx-auto mt-16 max-w-5xl">
			<AppMockup />
		</div>
	</div>
</section>
