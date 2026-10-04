<script lang="ts">
	import { CircleCheck, CircleDashed, Lightbulb } from '@lucide/svelte';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';

	const done = [
		'Server foundation: adapter-node, SQLite, Drizzle, migrations',
		'Auth, sessions, and one shared can() permission check',
		'Documents, audit log, dashboard, users, departments, settings and workflow on the real API',
		'Backups, restore script, retention and archiving',
		'Desktop app: Tauri build with a server-address setting',
		'Branding, full-text search, comments, notifications and My tasks'
	];

	const next = [
		'Playwright tests for the main flows and a clean lint',
		'CI on GitHub Actions, including desktop app builds'
	];

	const later = [
		'Email notifications',
		'Two-factor sign-in',
		'OCR for scanned PDFs',
		'Version rollback UI',
		'Postgres option'
	];
</script>

<section id="roadmap" class="border-t border-neutral-200 bg-neutral-50 py-24 sm:py-32 dark:border-neutral-800 dark:bg-neutral-900/40">
	<div class="container-page">
		<SectionHeader eyebrow="Roadmap" title="Where eDMS is today, and what comes next">
			Every page now runs on the real server and database, in the browser and the desktop app. Next
			up is test coverage and CI.
		</SectionHeader>

		<div class="mt-16 grid gap-6 lg:grid-cols-3">
			<div use:reveal class="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
				<p class="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
					<CircleCheck class="size-4" /> Done
				</p>
				<ol class="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
					{#each done as item, i (item)}
						<li class="flex gap-3"><span class="font-mono text-xs text-neutral-400">{i + 1}.</span>{item}</li>
					{/each}
				</ol>
			</div>
			<div use:reveal={{ delay: 120 }} class="rounded-xl border-2 border-neutral-950 bg-white p-6 dark:border-white dark:bg-neutral-950">
				<p class="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
					<CircleDashed class="size-4" /> Next
				</p>
				<ol class="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
					{#each next as item, i (item)}
						<li class="flex gap-3"><span class="font-mono text-xs text-neutral-400">{i + done.length + 1}.</span>{item}</li>
					{/each}
				</ol>
			</div>
			<div use:reveal={{ delay: 240 }} class="rounded-xl border border-dashed border-neutral-300 bg-white/50 p-6 dark:border-neutral-700 dark:bg-neutral-950/50">
				<p class="flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
					<Lightbulb class="size-4" /> Later ideas
				</p>
				<ul class="mt-4 flex flex-wrap gap-2">
					{#each later as item (item)}
						<li class="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
							{item}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>
