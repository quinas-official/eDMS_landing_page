<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';

	type Kind = 'New' | 'Improved' | 'Fixed';
	type Release = { date: string; label: string; items: { kind: Kind; text: string }[] };

	// Newest first. Add an entry here when a visible change ships; keep README "Changes" in step.
	const releases: Release[] = [
		{
			date: '2026-09-28',
			label: 'Sep 28, 2026',
			items: [
				{
					kind: 'Improved',
					text: 'Feature cards invert on hover: black with white text in light mode, white with black text in dark mode.'
				},
				{ kind: 'Fixed', text: 'The Security permissions table now fits on phone screens without scrolling sideways.' },
				{
					kind: 'New',
					text: 'Landing page launched with Features, Version History, Workflow, Architecture, Security, Get Started and Roadmap, in light and dark themes.'
				}
			]
		}
	];

	const kindClass: Record<Kind, string> = {
		New: 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950',
		Improved: 'border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300',
		Fixed: 'border border-dashed border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'
	};
</script>

<section id="updates" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
	<div class="container-page">
		<SectionHeader eyebrow="Updates" title="What's new">
			Features and fixes as they ship, newest first.
		</SectionHeader>

		<ol class="mx-auto mt-16 max-w-3xl space-y-12">
			{#each releases as release (release.date)}
				<li use:reveal class="grid gap-4 sm:grid-cols-[9rem_1fr] sm:gap-8">
					<time datetime={release.date} class="font-mono text-sm text-neutral-500 sm:pt-1 dark:text-neutral-400">
						{release.label}
					</time>
					<ul class="space-y-4 border-l border-neutral-200 pl-6 dark:border-neutral-800">
						{#each release.items as item (item.text)}
							<li class="flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
								<span class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold {kindClass[item.kind]}">
									{item.kind}
								</span>
								<p class="text-sm text-pretty text-neutral-700 sm:pt-0.5 dark:text-neutral-300">{item.text}</p>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
	</div>
</section>
