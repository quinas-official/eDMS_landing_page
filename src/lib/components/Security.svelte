<script lang="ts">
	import { Check, Minus, KeyRound, Lock, ServerCog, Gauge } from '@lucide/svelte';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';

	const permissions = ['view', 'upload', 'approve', 'delete'] as const;
	const matrix: { role: string; grants: (typeof permissions)[number][]; locked?: boolean }[] = [
		{ role: 'admin', grants: ['view', 'upload', 'approve', 'delete'], locked: true },
		{ role: 'editor', grants: ['view', 'upload'] },
		{ role: 'viewer', grants: ['view'] }
	];

	const points = [
		{
			icon: ServerCog,
			title: 'The server has the final say',
			body: 'The UI only uses permissions to decide what to show. Every API request is checked again on the server.'
		},
		{
			icon: KeyRound,
			title: 'Hashed session tokens',
			body: 'Session IDs are stored as SHA-256 hashes, never raw. Web sessions use httpOnly cookies; the desktop app uses bearer tokens.'
		},
		{
			icon: Gauge,
			title: 'Throttled sign-in',
			body: 'Login attempts are rate limited per client, including behind a reverse proxy.'
		},
		{
			icon: Lock,
			title: 'Admin-only administration',
			body: 'Users, departments and settings can only be managed by admins, who can never be locked out by a bad matrix edit.'
		}
	];
</script>

<section id="security" class="border-y border-neutral-200 bg-neutral-50 py-24 sm:py-32 dark:border-neutral-800 dark:bg-neutral-900/40">
	<div class="container-page">
		<SectionHeader eyebrow="Security & access" title="Access that follows your roles and departments">
			Roles map to permissions through a matrix in Settings. Department scoping decides which
			documents each person can see.
		</SectionHeader>

		<div class="mt-16 grid gap-10 lg:grid-cols-2">
			<div use:reveal class="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
				<div class="border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
					<p class="text-sm font-semibold text-neutral-900 dark:text-white">Role matrix</p>
					<p class="text-xs text-neutral-500 dark:text-neutral-400">Example configuration, editable in Settings</p>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="text-neutral-500 dark:text-neutral-400">
								<th class="px-5 py-3 text-left font-medium">Role</th>
								{#each permissions as p (p)}
									<th class="px-2 py-3 text-center sm:px-3 font-medium capitalize">{p}</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
							{#each matrix as row (row.role)}
								<tr>
									<td class="px-5 py-3 font-medium text-neutral-900 capitalize dark:text-neutral-100">
										{row.role}
										{#if row.locked}
											<span class="ml-1 text-xs font-normal text-neutral-400">(always all)</span>
										{/if}
									</td>
									{#each permissions as p (p)}
										<td class="px-2 py-3 text-center sm:px-3">
											{#if row.grants.includes(p)}
												<Check class="mx-auto size-4 text-neutral-950 dark:text-white" aria-label="Granted" />
											{:else}
												<Minus class="mx-auto size-4 text-neutral-300 dark:text-neutral-600" aria-label="Not granted" />
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="border-t border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
					<span class="font-medium text-neutral-900 dark:text-neutral-100">Department scoping:</span>
					admins and approvers see every department. Everyone else sees their own department plus
					documents they own or are assigned to.
				</div>
			</div>

			<ul class="grid gap-6 sm:grid-cols-2">
				{#each points as pt, i (pt.title)}
					<li use:reveal={{ delay: 150 + i * 100 }}>
						<pt.icon class="size-5 text-neutral-950 dark:text-white" />
						<h3 class="mt-3 font-semibold text-neutral-900 dark:text-white">{pt.title}</h3>
						<p class="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{pt.body}</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
