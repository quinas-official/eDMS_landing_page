<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';

	type Kind = 'New' | 'Improved' | 'Fixed' | 'Site';
	type Release = { date: string; label: string; items: { kind: Kind; text: string }[] };

	// Newest first. Taken from the eDMS app's history (and this site's own changes, tagged "Site").
	// Add an entry here when a visible change ships; keep README "Changes" in step.
	const releases: Release[] = [
		{
			date: '2026-10-04',
			label: 'Oct 4, 2026',
			items: [
				{
					kind: 'New',
					text: 'Branding: set your app name, logo and colour scheme in Settings. It applies to the web app, the desktop app and the sign-in page, and text colours adjust for contrast.'
				},
				{
					kind: 'New',
					text: 'Search inside documents: full-text search over titles, references and the text of Word, PDF and plain-text files, with the matching passage highlighted. Accents are ignored.'
				},
				{
					kind: 'New',
					text: 'Comments on every document, an in-app notification bell, and a My tasks page listing what is waiting for you.'
				},
				{
					kind: 'New',
					text: 'Automatic daily backups on the server, with a warning on the dashboard when there has been no backup for a week.'
				},
				{ kind: 'Site', text: 'New features listed on this page, the Roadmap brought up to date, and this Updates section.' }
			]
		},
		{
			date: '2026-10-01',
			label: 'Oct 1, 2026',
			items: [
				{
					kind: 'New',
					text: 'Desktop app for Windows, macOS and Linux. It asks for the server address on first launch and offers Try again if the server stops answering.'
				},
				{
					kind: 'New',
					text: 'Backup download (database plus files) and a restore script that keeps your previous data. Retention can auto-archive untouched documents and purge old deletions.'
				},
				{
					kind: 'Improved',
					text: 'The workflow board, dashboard, users, departments and settings now run on the real server instead of sample data.'
				},
				{
					kind: 'Improved',
					text: 'Drag a card on the workflow board to change its status. Columns you are not allowed to move into are locked.'
				}
			]
		},
		{
			date: '2026-09-28',
			label: 'Sep 28, 2026',
			items: [
				{
					kind: 'New',
					text: 'Audit log on the server, with search and filters. It can no longer be cleared.'
				},
				{
					kind: 'Improved',
					text: 'Documents page on the real API: server-side search, filters and paging, new versions with notes, soft delete and restore.'
				},
				{ kind: 'Improved', text: 'Readable dates such as "5 minutes ago", and notifications when something is saved or fails.' },
				{
					kind: 'Site',
					text: 'Landing page launched, with feature cards that invert on hover and a Security table that fits on phones.'
				}
			]
		},
		{
			date: '2026-09-26',
			label: 'Sep 26, 2026',
			items: [
				{
					kind: 'New',
					text: 'Real sign-in with sessions, and one permission check shared by the server and the UI.'
				},
				{
					kind: 'New',
					text: 'Documents stored on disk with every version kept, a SHA-256 hash per file, and department scoping.'
				}
			]
		},
		{
			date: '2026-09-25',
			label: 'Sep 25, 2026',
			items: [{ kind: 'New', text: 'Server foundation: SQLite database with automatic migrations.' }]
		}
	];

	const kindClass: Record<Kind, string> = {
		New: 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950',
		Improved: 'border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300',
		Fixed: 'border border-dashed border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400',
		Site: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400'
	};
</script>

<section id="updates" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
	<div class="container-page">
		<SectionHeader eyebrow="Updates" title="What's new">
			New features and improvements in eDMS as they ship, newest first.
		</SectionHeader>

		<ol class="mx-auto mt-16 max-w-3xl space-y-12">			{#each releases as release (release.date)}
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
