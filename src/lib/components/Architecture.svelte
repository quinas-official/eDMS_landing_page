<script lang="ts">
	import GridBackdrop from './GridBackdrop.svelte';
	import { Globe, Monitor, Server, Database, HardDrive } from '@lucide/svelte';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';

	const stack = [
		{ area: 'Framework', value: 'SvelteKit 2 · Svelte 5 · TypeScript' },
		{ area: 'Server', value: 'adapter-node (UI + /api in one process)' },
		{ area: 'Database', value: 'SQLite via Drizzle ORM' },
		{ area: 'File storage', value: 'Local disk, SHA-256 per version' },
		{ area: 'UI', value: 'TailwindCSS 4 · bits-ui · Lucide · Chart.js' },
		{ area: 'Previews', value: 'mammoth (DOCX → HTML) · diff' },
		{ area: 'Desktop', value: 'Electron (sandboxed, no Node in the page)' },
		{ area: 'Tests', value: 'Vitest · Playwright · GitHub Actions CI' }
	];
</script>

<section id="architecture" class="relative isolate py-24 sm:py-32">
	<GridBackdrop />
	<div class="container-page">
		<SectionHeader eyebrow="Architecture" title="Two apps, one central server">
			The browser and the desktop app use the same JSON API. There is one server process, one
			database file and one folder of documents to back up.
		</SectionHeader>

		<!-- Diagram: clients → server → storage -->
		<div use:reveal class="mt-16 grid items-center gap-6 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
			<div class="space-y-3">
				<div class="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
					<div class="flex items-center gap-3">
						<Globe class="size-5 text-neutral-950 dark:text-white" />
						<p class="font-semibold text-neutral-900 dark:text-white">Browser</p>
					</div>
					<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">httpOnly session cookie</p>
				</div>
				<div class="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
					<div class="flex items-center gap-3">
						<Monitor class="size-5 text-neutral-950 dark:text-white" />
						<p class="font-semibold text-neutral-900 dark:text-white">Desktop app</p>
					</div>
					<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Bearer token, Electron</p>
				</div>
			</div>

			<div class="flex justify-center text-neutral-400" aria-hidden="true">
				<span class="font-mono text-xs lg:hidden">↓ /api/*</span>
				<span class="hidden font-mono text-xs lg:block">/api/* →</span>
			</div>

			<div class="rounded-2xl border-2 border-neutral-950 bg-white p-6 dark:border-white dark:bg-neutral-950">
				<div class="flex items-center gap-3">
					<div class="grid size-10 place-items-center rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
						<Server class="size-5" />
					</div>
					<div>
						<p class="font-semibold text-neutral-900 dark:text-white">SvelteKit Node server</p>
						<p class="text-sm text-neutral-500 dark:text-neutral-400">UI + JSON API on your LAN</p>
					</div>
				</div>
				<ul class="mt-5 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
					<li>• Authenticates every request in <code class="font-mono text-xs">hooks.server.ts</code></li>
					<li>• Checks one shared <code class="font-mono text-xs">can(user, permission)</code></li>
					<li>• Runs database migrations on start</li>
				</ul>
			</div>

			<div class="flex justify-center text-neutral-400" aria-hidden="true">
				<span class="font-mono text-xs lg:hidden">↓</span>
				<span class="hidden font-mono text-xs lg:block">→</span>
			</div>

			<div class="space-y-3">
				<div class="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
					<div class="flex items-center gap-3">
						<Database class="size-5 text-neutral-950 dark:text-white" />
						<p class="font-semibold text-neutral-900 dark:text-white">SQLite</p>
					</div>
					<p class="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">data/edms.db</p>
				</div>
				<div class="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
					<div class="flex items-center gap-3">
						<HardDrive class="size-5 text-neutral-950 dark:text-white" />
						<p class="font-semibold text-neutral-900 dark:text-white">Files on disk</p>
					</div>
					<p class="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">data/files</p>
				</div>
			</div>
		</div>

		<dl use:reveal={{ delay: 150 }} class="mt-16 grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-800">
			{#each stack as item (item.area)}
				<div class="bg-white px-5 py-4 dark:bg-neutral-950">
					<dt class="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{item.area}</dt>
					<dd class="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>
