<script lang="ts">
	import GridBackdrop from './GridBackdrop.svelte';
	import {
		History,
		GitPullRequestArrow,
		ScrollText,
		ShieldCheck,
		Building2,
		Eye,
		Trash2,
		Hash
	} from '@lucide/svelte';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';

	const features = [
		{
			icon: History,
			title: 'Every version kept',
			body: 'Each upload becomes a new version with its original name, size and note. Editing only the metadata is logged, not versioned, so history stays meaningful.'
		},
		{
			icon: GitPullRequestArrow,
			title: 'Approval workflow',
			body: 'Documents move from Draft to Pending, Reviewed and Approved, or get Rejected, with an assignee responsible for each step.'
		},
		{
			icon: ScrollText,
			title: 'Append-only audit log',
			body: 'Uploads, edits, status changes and deletes are recorded with field-level diffs. SQL triggers refuse any UPDATE or DELETE on the log.'
		},
		{
			icon: ShieldCheck,
			title: 'Role-based permissions',
			body: 'Admin, editor and viewer roles map to view, upload, approve and delete through a matrix you configure. Admins always keep every permission.'
		},
		{
			icon: Building2,
			title: 'Department scoping',
			body: "People see their own department's documents plus anything they own or are assigned. Approvers and admins see across departments."
		},
		{
			icon: Eye,
			title: 'In-browser previews',
			body: 'DOCX files render as HTML right in the browser, and you can diff the text of any two versions to see exactly what changed.'
		},
		{
			icon: Hash,
			title: 'Integrity by SHA-256',
			body: 'Every stored file version is hashed with SHA-256, and each document gets a readable reference code such as HR-2024-091.'
		},
		{
			icon: Trash2,
			title: 'Soft delete & restore',
			body: 'Deleted documents move to a recoverable state instead of disappearing, and can be restored with their full history intact.'
		}
	];
</script>

<section id="features" class="relative isolate py-24 sm:py-32">
	<GridBackdrop />
	<div class="container-page">
		<SectionHeader eyebrow="Features" title="Everything a records team needs, nothing it doesn't">
			Built for organizations that want control over their files: clear ownership, a paper trail you
			can trust, and access that follows your org chart.
		</SectionHeader>

		<div class="mt-16 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-800">
			{#each features as f, i (f.title)}
				<div class="bg-white p-6 dark:bg-neutral-950">
					<div use:reveal={{ delay: (i % 4) * 90 }}>
					<div
						class="grid size-10 place-items-center rounded-lg bg-neutral-100 text-neutral-950 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800"
					>
						<f.icon class="size-5" />
					</div>
					<h3 class="mt-4 font-semibold text-neutral-900 dark:text-white">{f.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{f.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
