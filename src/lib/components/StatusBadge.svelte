<script lang="ts" module>
	export type Status = 'draft' | 'pending' | 'reviewed' | 'approved' | 'rejected';

	export const statusStyles: Record<Status, string> = {
		draft: 'bg-neutral-100 text-neutral-700 ring-neutral-500/20 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-400/20',
		pending:
			'bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/25',
		reviewed:
			'bg-sky-50 text-sky-800 ring-sky-600/25 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/25',
		approved:
			'bg-emerald-50 text-emerald-800 ring-emerald-600/25 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25',
		rejected:
			'bg-rose-50 text-rose-800 ring-rose-600/25 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/25'
	};
</script>

<script lang="ts">
	let { status }: { status: Status } = $props();
</script>

<span
	class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset {statusStyles[
		status
	]}"
>
	{status}
</span>
