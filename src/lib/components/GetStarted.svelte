<script lang="ts">
	import GridBackdrop from './GridBackdrop.svelte';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';
	import CodeBlock from './CodeBlock.svelte';

	const steps = [
		{
			title: 'Install and configure',
			body: 'Copy .env.example and adjust the database path, storage folder and admin username.'
		},
		{
			title: 'Seed the database',
			body: 'Creates the database, default departments and the admin account. If no password is set, one is generated and printed. Safe to run again.'
		},
		{
			title: 'Build and run on the LAN',
			body: 'Set ORIGIN to the server’s LAN URL and PORT in .env, then start it. Check it is up at /api/health.'
		}
	];

	const env = [
		{ name: 'DATABASE_URL', value: 'data/edms.db' },
		{ name: 'STORAGE_DIR', value: 'data/files' },
		{ name: 'ORIGIN', value: 'http://edms.office.lan' },
		{ name: 'PORT', value: '3000' },
		{ name: 'BODY_SIZE_LIMIT', value: 'above your max upload size' }
	];
</script>

<section id="get-started" class="relative isolate py-24 sm:py-32">
	<GridBackdrop />
	<div class="container-page">
		<SectionHeader eyebrow="Get started" title="Running on your network in a few minutes">
			One machine on the LAN runs the server. Everyone else just opens its address in a browser.
		</SectionHeader>

		<div class="mt-16 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
			<ol class="space-y-8">
				{#each steps as step, i (step.title)}
					<li use:reveal={{ delay: i * 120 }} class="flex gap-4">
						<span
							class="grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
						>
							{i + 1}
						</span>
						<div>
							<h3 class="font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
							<p class="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.body}</p>
						</div>
					</li>
				{/each}

				<li use:reveal={{ delay: 360 }} class="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
					<p class="text-sm font-semibold text-neutral-900 dark:text-white">Key settings in <code class="font-mono">.env</code></p>
					<dl class="mt-3 space-y-1.5 font-mono text-xs">
						{#each env as e (e.name)}
							<div class="flex flex-wrap gap-x-2">
								<dt class="text-neutral-950 dark:text-white">{e.name}</dt>
								<dd class="text-neutral-500 dark:text-neutral-400">{e.value}</dd>
							</div>
						{/each}
					</dl>
				</li>
			</ol>

			<div class="space-y-4">
				<CodeBlock
					title="Development"
					lines={[
						{ cmd: 'bun install' },
						{ cmd: 'cp .env.example .env', comment: 'adjust paths / admin username' },
						{ cmd: 'bun run db:seed', comment: 'add -- --demo for editor1 & viewer1' },
						{ cmd: 'bun run dev' }
					]}
				/>
				<CodeBlock
					delay={150}
					title="Production (LAN server)"
					lines={[
						{ cmd: 'bun run build' },
						{ cmd: 'bun run start', comment: 'set ORIGIN and PORT in .env' },
						{ cmd: 'curl http://edms.office.lan/api/health' }
					]}
				/>
				<p use:reveal={{ delay: 300 }} class="text-sm text-neutral-500 dark:text-neutral-400">
					Prefer npm? It works too. Swap <code class="font-mono text-xs">bun</code> for
					<code class="font-mono text-xs">npm</code>.
				</p>
			</div>
		</div>
	</div>
</section>
