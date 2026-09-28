<script lang="ts">
	import { ChevronRight, CornerDownRight } from '@lucide/svelte';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';
	import StatusBadge, { type Status } from './StatusBadge.svelte';

	const stages: { status: Status; who: string; body: string }[] = [
		{ status: 'draft', who: 'Editor', body: 'Upload a file and fill in title, description and department.' },
		{ status: 'pending', who: 'Editor', body: 'Submit for review and assign someone to take it forward.' },
		{ status: 'reviewed', who: 'Reviewer', body: 'Content is checked. Earlier versions can be compared line by line.' },
		{ status: 'approved', who: 'Approver', body: 'Someone with the approve permission signs it off for use.' }
	];

	const log = [
		{ time: '09:14', actor: 'S. Rahman', action: 'uploaded v3 of', target: 'OPS-2024-038' },
		{ time: '09:20', actor: 'S. Rahman', action: 'changed status draft → pending on', target: 'OPS-2024-038' },
		{ time: '11:02', actor: 'M. Okafor', action: 'changed status pending → reviewed on', target: 'OPS-2024-038' },
		{ time: '14:45', actor: 'L. Chen', action: 'changed status reviewed → approved on', target: 'OPS-2024-038' }
	];
</script>

<section id="workflow" class="border-y border-neutral-200 bg-neutral-50 py-24 sm:py-32 dark:border-neutral-800 dark:bg-neutral-900/40">
	<div class="container-page">
		<SectionHeader eyebrow="Workflow" title="From draft to approved, with a record of every step">
			A board shows where each document stands. Each status change is checked against the
			person's permissions on the server and written to the audit log.
		</SectionHeader>

		<ol class="mt-16 grid gap-4 md:grid-cols-4">
			{#each stages as stage, i (stage.status)}
				<li use:reveal={{ delay: i * 120 }} class="relative rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
					<div class="flex items-center justify-between">
						<StatusBadge status={stage.status} />
						<span class="font-mono text-xs text-neutral-400">0{i + 1}</span>
					</div>
					<p class="mt-4 text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{stage.who}</p>
					<p class="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{stage.body}</p>
					{#if i < stages.length - 1}
						<ChevronRight
							class="absolute top-1/2 -right-3.5 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-neutral-50 text-neutral-400 md:block dark:bg-neutral-900"
						/>
					{/if}
				</li>
			{/each}
		</ol>
		<p use:reveal={{ delay: 480 }} class="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
			<CornerDownRight class="size-4" />
			At any review step a document can be <StatusBadge status="rejected" /> and sent back with a new version.
		</p>

		<div use:reveal class="mt-12 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
			<div class="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
				<p class="text-sm font-semibold text-neutral-900 dark:text-white">Audit log</p>
				<p class="font-mono text-xs text-neutral-400">activity_log · append-only</p>
			</div>
			<ul class="divide-y divide-neutral-100 font-mono text-xs sm:text-sm dark:divide-neutral-800/70">
				{#each log as entry, i (i)}
					<li use:reveal={{ delay: 200 + i * 150 }} class="flex gap-4 px-5 py-3">
						<span class="shrink-0 text-neutral-400">{entry.time}</span>
						<span class="text-neutral-600 dark:text-neutral-400">
							<span class="font-medium text-neutral-900 dark:text-neutral-100">{entry.actor}</span>
							{entry.action}
							<span class="text-neutral-950 dark:text-white">{entry.target}</span>
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
