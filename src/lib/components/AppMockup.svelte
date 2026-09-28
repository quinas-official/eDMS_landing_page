<script lang="ts">
	import {
		FileText,
		FolderKanban,
		LayoutDashboard,
		Search,
		Settings,
		Upload,
		Users,
		Building2
	} from '@lucide/svelte';
	import StatusBadge, { type Status } from './StatusBadge.svelte';

	const nav = [
		{ icon: LayoutDashboard, label: 'Dashboard' },
		{ icon: FileText, label: 'Documents', active: true },
		{ icon: FolderKanban, label: 'Workflow' },
		{ icon: Building2, label: 'Departments' },
		{ icon: Users, label: 'Users' },
		{ icon: Settings, label: 'Settings' }
	];

	const docs: { code: string; title: string; dept: string; status: Status; version: number }[] = [
		{ code: 'HR-2024-091', title: 'Leave policy 2025', dept: 'HR', status: 'approved', version: 4 },
		{ code: 'FIN-2024-212', title: 'Q3 budget variance report', dept: 'Finance', status: 'reviewed', version: 2 },
		{ code: 'OPS-2024-038', title: 'Warehouse safety checklist', dept: 'Operations', status: 'pending', version: 3 },
		{ code: 'IT-2024-117', title: 'Backup & recovery procedure', dept: 'IT', status: 'draft', version: 1 },
		{ code: 'LEG-2024-064', title: 'Vendor NDA template', dept: 'Legal', status: 'rejected', version: 2 }
	];
</script>

<div
	class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10 ring-1 ring-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/40"
	aria-hidden="true"
>
	<!-- window chrome -->
	<div class="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
		<span class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
		<span class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
		<span class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
		<div
			class="mx-auto rounded-md bg-neutral-100 px-3 py-0.5 font-mono text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
		>
			http://edms.office.lan/admin/documents
		</div>
	</div>

	<div class="flex text-left">
		<aside class="hidden w-44 shrink-0 border-r border-neutral-200 p-3 sm:block dark:border-neutral-800">
			<ul class="space-y-0.5">
				{#each nav as item (item.label)}
					<li
						class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium {item.active
							? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white'
							: 'text-neutral-500 dark:text-neutral-400'}"
					>
						<item.icon class="size-3.5" />
						{item.label}
					</li>
				{/each}
			</ul>
		</aside>

		<div class="min-w-0 flex-1 p-4">
			<div class="mb-3 flex items-center justify-between gap-3">
				<div>
					<p class="text-sm font-semibold text-neutral-900 dark:text-white">Documents</p>
					<p class="text-[11px] text-neutral-500 dark:text-neutral-400">5 of 1,284 · all departments</p>
				</div>
				<div class="flex items-center gap-2">
					<div
						class="hidden items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-400 md:flex dark:border-neutral-700"
					>
						<Search class="size-3" /> Search documents…
					</div>
					<div
						class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
					>
						<Upload class="size-3" /> Upload
					</div>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
				<table class="w-full text-[11px]">
					<thead class="bg-neutral-50 text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
						<tr>
							<th class="px-3 py-2 text-left font-medium">Reference</th>
							<th class="w-2/5 px-3 py-2 text-left font-medium">Title</th>
							<th class="hidden px-3 py-2 text-left font-medium md:table-cell">Department</th>
							<th class="px-3 py-2 text-left font-medium">Status</th>
							<th class="hidden px-3 py-2 text-right font-medium sm:table-cell">Ver.</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
						{#each docs as doc (doc.code)}
							<tr>
								<td class="px-3 py-2 font-mono whitespace-nowrap text-neutral-500 dark:text-neutral-400">{doc.code}</td>
								<td class="max-w-0 truncate px-3 py-2 font-medium text-neutral-800 dark:text-neutral-200">
									{doc.title}
								</td>
								<td class="hidden px-3 py-2 text-neutral-500 md:table-cell dark:text-neutral-400">{doc.dept}</td>
								<td class="px-3 py-2"><StatusBadge status={doc.status} /></td>
								<td class="hidden px-3 py-2 text-right font-mono text-neutral-500 sm:table-cell dark:text-neutral-400">
									v{doc.version}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
