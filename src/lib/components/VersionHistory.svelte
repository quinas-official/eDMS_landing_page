<script lang="ts">
	import { onDestroy } from 'svelte';
	import { FileText, GitCommitVertical, Pause, Play, Columns2, Rows3 } from '@lucide/svelte';
	import { diffLines, toSplitRows, type DiffLine } from '$lib/diff';
	import { reveal, prefersReducedMotion } from '$lib/actions/reveal';
	import SectionHeader from './SectionHeader.svelte';

	type Version = {
		v: number;
		author: string;
		initials: string;
		color: string;
		note: string;
		when: string;
		sha: string;
		lines: string[];
	};

	const v1 = [
		'# Annual Leave Policy',
		'Full-time employees receive 15 days of paid leave per year.',
		'Leave requests must be submitted 7 days in advance.',
		'Unused leave expires at the end of the year.',
		'Approval is given by the department head.'
	];
	const v2 = [
		v1[0],
		'Full-time employees receive 18 days of paid leave per year.',
		'Leave requests must be submitted 14 days in advance.',
		v1[3],
		v1[4]
	];
	const v3 = [
		v2[0],
		v2[1],
		'Part-time employees receive leave in proportion to their hours.',
		v2[2],
		'Up to 5 unused days carry over to the next year.',
		v2[4]
	];
	const v4 = [
		'# Annual Leave Policy 2025',
		v3[1],
		v3[2],
		v3[3],
		v3[4],
		'Approval is given by the department head and recorded in eDMS.'
	];

	const versions: Version[] = [
		{ v: 4, author: 'L. Chen', initials: 'LC', color: 'bg-neutral-800', note: 'Clarify approval route for 2025', when: '2 days ago', sha: '9f3c2ab', lines: v4 },
		{ v: 3, author: 'M. Okafor', initials: 'MO', color: 'bg-neutral-600', note: 'Allow carry-over, add part-time rule', when: '1 week ago', sha: 'e41d08c', lines: v3 },
		{ v: 2, author: 'S. Rahman', initials: 'SR', color: 'bg-neutral-500', note: 'Raise allowance, longer notice period', when: '3 weeks ago', sha: '5b7a9e1', lines: v2 },
		{ v: 1, author: 'S. Rahman', initials: 'SR', color: 'bg-neutral-500', note: 'Initial upload', when: '2 months ago', sha: 'c0de4f2', lines: v1 }
	];

	let selected = $state(4);
	let mode = $state<'unified' | 'split'>('unified');
	let playing = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;

	const current = $derived(versions.find((x) => x.v === selected)!);
	const previous = $derived(versions.find((x) => x.v === selected - 1));
	const lines = $derived(diffLines(previous?.lines ?? [], current.lines));
	const rows = $derived(toSplitRows(lines));
	const additions = $derived(lines.filter((l) => l.type === 'add').length);
	const deletions = $derived(lines.filter((l) => l.type === 'del').length);

	// GitHub's five-square change bar.
	const bar = $derived.by(() => {
		const total = additions + deletions || 1;
		const green = Math.round((additions / total) * 5);
		const red = Math.min(5 - green, Math.round((deletions / total) * 5));
		return [...Array(green).fill('add'), ...Array(red).fill('del'), ...Array(5 - green - red).fill('none')];
	});

	function select(v: number) {
		stop();
		selected = v;
	}

	function play() {
		playing = true;
		selected = 1;
		timer = setInterval(() => {
			if (selected >= 4) return stop();
			selected += 1;
		}, 2600);
	}

	function stop() {
		playing = false;
		clearInterval(timer);
	}

	onDestroy(stop);

	const rowBg = { equal: '', del: 'bg-rose-50 dark:bg-rose-500/10', add: 'bg-emerald-50 dark:bg-emerald-500/10' };
	const gutterBg = {
		equal: 'text-neutral-400 dark:text-neutral-600',
		del: 'bg-rose-100 text-rose-400 dark:bg-rose-500/15 dark:text-rose-400/70',
		add: 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400/70'
	};
	const wordBg = { equal: '', del: 'bg-rose-200 dark:bg-rose-500/35', add: 'bg-emerald-200 dark:bg-emerald-500/35' };
	const sign = { equal: ' ', del: '−', add: '+' };
</script>

{#snippet content(line: DiffLine | undefined)}
	{#if line}
		<span class="mr-2 inline-block w-3 text-neutral-400 select-none">{sign[line.type]}</span>{#each line.segments as seg, i (i)}<span
				class={seg.changed ? `rounded-sm ${wordBg[line.type]}` : ''}>{seg.text}</span
			>{/each}
	{/if}
{/snippet}

<section id="history" class="py-24 sm:py-32">
	<div class="container-page">
		<SectionHeader eyebrow="Version history" title="See exactly which words changed, version by version">
			Every upload is kept. Pick any version and eDMS compares its text with the one before it,
			down to the individual word.
		</SectionHeader>

		<div
			class="mt-16 grid gap-6 lg:grid-cols-[20rem_1fr]"
			use:reveal={{ delay: 120, onenter: () => !prefersReducedMotion() && play() }}
		>
			<!-- Commit-style version list -->
			<div class="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
				<div class="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
					<p class="text-sm font-semibold text-neutral-900 dark:text-white">
						HR-2024-091 <span class="font-normal text-neutral-500 dark:text-neutral-400">· 4 versions</span>
					</p>
					<button
						type="button"
						onclick={() => (playing ? stop() : play())}
						class="flex items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
					>
						{#if playing}<Pause class="size-3" /> Pause{:else}<Play class="size-3" /> Replay{/if}
					</button>
				</div>
				<ol class="relative">
					{#each versions as ver (ver.v)}
						<li>
							<button
								type="button"
								onclick={() => select(ver.v)}
								aria-pressed={selected === ver.v}
								class="relative flex w-full gap-3 border-l-2 px-4 py-3 text-left transition {selected === ver.v
									? 'border-neutral-950 bg-neutral-100 dark:border-white dark:bg-neutral-900'
									: 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900'}"
							>
								<span
									class="grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white {ver.color}"
								>
									{ver.initials}
								</span>
								<span class="min-w-0 flex-1">
									<span class="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{ver.note}</span>
									<span class="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
										{ver.author} uploaded {ver.when}
									</span>
								</span>
								<span class="flex flex-col items-end gap-1">
									<span class="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
										v{ver.v}
									</span>
									<span class="flex items-center gap-0.5 font-mono text-[10px] text-neutral-400">
										<GitCommitVertical class="size-3" />{ver.sha}
									</span>
								</span>
							</button>
						</li>
					{/each}
				</ol>
			</div>

			<!-- Diff viewer -->
			<div class="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
				<div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/60">
					<FileText class="size-4 text-neutral-400" />
					<p class="min-w-0 flex-1 truncate font-mono text-xs text-neutral-700 dark:text-neutral-300">
						leave-policy.docx
						<span class="text-neutral-400">
							{previous ? `v${previous.v} → v${current.v}` : `v${current.v} (new file)`}
						</span>
					</p>
					<p class="flex items-center gap-2 font-mono text-xs">
						<span class="font-semibold text-emerald-600 dark:text-emerald-400">+{additions}</span>
						<span class="font-semibold text-rose-600 dark:text-rose-400">−{deletions}</span>
						<span class="flex gap-0.5" aria-hidden="true">
							{#each bar as b, i (i)}
								<span
									class="size-2 rounded-xs {b === 'add'
										? 'bg-emerald-500'
										: b === 'del'
											? 'bg-rose-500'
											: 'bg-neutral-300 dark:bg-neutral-700'}"
								></span>
							{/each}
						</span>
					</p>
					<div class="hidden rounded-md border border-neutral-200 p-0.5 md:flex dark:border-neutral-700" role="group" aria-label="Diff layout">
						{#each [{ id: 'unified', icon: Rows3, label: 'Unified' }, { id: 'split', icon: Columns2, label: 'Split' }] as opt (opt.id)}
							<button
								type="button"
								onclick={() => (mode = opt.id as 'unified' | 'split')}
								aria-pressed={mode === opt.id}
								class="flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition {mode === opt.id
									? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white'
									: 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'}"
							>
								<opt.icon class="size-3" />{opt.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="overflow-x-auto font-mono text-[12.5px] leading-6">
					{#key `${selected}-${mode}`}
						{#if mode === 'unified'}
							<table class="w-full border-collapse">
								<tbody>
									{#each lines as line, i (i)}
										<tr class="animate-diff-in {rowBg[line.type]}" style="animation-delay: {i * 45}ms">
											<td class="w-10 px-2 text-right select-none {gutterBg[line.type]}">{line.oldNo ?? ''}</td>
											<td class="w-10 px-2 text-right select-none {gutterBg[line.type]}">{line.newNo ?? ''}</td>
											<td class="px-3 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">{@render content(line)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						{:else}
							<table class="w-full table-fixed border-collapse">
								<tbody>
									{#each rows as row, i (i)}
										<tr class="animate-diff-in" style="animation-delay: {i * 45}ms">
											<td class="w-10 px-2 text-right align-top select-none {row.left ? gutterBg[row.left.type] : 'bg-neutral-50 dark:bg-neutral-900/60'}">{row.left?.oldNo ?? ''}</td>
											<td class="border-r border-neutral-200 px-3 align-top whitespace-pre-wrap text-neutral-800 dark:border-neutral-800 dark:text-neutral-200 {row.left ? rowBg[row.left.type] : 'bg-neutral-50 dark:bg-neutral-900/60'}">{@render content(row.left)}</td>
											<td class="w-10 px-2 text-right align-top select-none {row.right ? gutterBg[row.right.type] : 'bg-neutral-50 dark:bg-neutral-900/60'}">{row.right?.newNo ?? ''}</td>
											<td class="px-3 align-top whitespace-pre-wrap text-neutral-800 dark:text-neutral-200 {row.right ? rowBg[row.right.type] : 'bg-neutral-50 dark:bg-neutral-900/60'}">{@render content(row.right)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						{/if}
					{/key}
				</div>

				<p class="border-t border-neutral-200 px-4 py-2.5 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
					<span class="font-medium text-neutral-700 dark:text-neutral-300">{current.author}</span>
					· “{current.note}” · SHA-256 <span class="font-mono">{current.sha}…</span>
				</p>
			</div>
		</div>
	</div>
</section>
