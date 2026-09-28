// Small line + word diff, enough to render a GitHub-style view of a few short documents.

export type Op<T> = { type: 'equal' | 'del' | 'add'; value: T };

/** Longest-common-subsequence diff of two sequences. */
export function diffSequence<T>(a: T[], b: T[]): Op<T>[] {
	const n = a.length;
	const m = b.length;
	const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
		}
	}

	const ops: Op<T>[] = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (a[i] === b[j]) {
			ops.push({ type: 'equal', value: a[i] });
			i++;
			j++;
		} else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
			ops.push({ type: 'del', value: a[i++] });
		} else {
			ops.push({ type: 'add', value: b[j++] });
		}
	}
	while (i < n) ops.push({ type: 'del', value: a[i++] });
	while (j < m) ops.push({ type: 'add', value: b[j++] });
	return ops;
}

/** A piece of a line; `changed` marks the words GitHub would highlight more strongly. */
export type Segment = { text: string; changed: boolean };

export type DiffLine = {
	type: 'equal' | 'del' | 'add';
	oldNo?: number;
	newNo?: number;
	segments: Segment[];
};

const tokenize = (line: string) => line.split(/(\s+)/).filter(Boolean);

/** Share of words the two lines have in common, from 0 to 1. */
function similarity(a: string, b: string) {
	const wa = a.split(/\s+/).filter(Boolean);
	const wb = b.split(/\s+/).filter(Boolean);
	const common = diffSequence(wa, wb).filter((op) => op.type === 'equal').length;
	return (2 * common) / (wa.length + wb.length || 1);
}

function wordSegments(oldLine: string, newLine: string) {
	const ops = diffSequence(tokenize(oldLine), tokenize(newLine));
	const del: Segment[] = [];
	const add: Segment[] = [];
	for (const op of ops) {
		if (op.type !== 'add') del.push({ text: op.value, changed: op.type === 'del' });
		if (op.type !== 'del') add.push({ text: op.value, changed: op.type === 'add' });
	}
	return { del, add };
}

/**
 * Line diff where each run of removed lines followed by added lines is paired up
 * and given word-level highlights, like GitHub's rich diff.
 */
export function diffLines(oldText: string[], newText: string[]): DiffLine[] {
	const ops = diffSequence(oldText, newText);
	const out: DiffLine[] = [];
	let oldNo = 1;
	let newNo = 1;

	for (let k = 0; k < ops.length; ) {
		if (ops[k].type === 'equal') {
			out.push({ type: 'equal', oldNo: oldNo++, newNo: newNo++, segments: [{ text: ops[k].value, changed: false }] });
			k++;
			continue;
		}

		const dels: string[] = [];
		const adds: string[] = [];
		while (k < ops.length && ops[k].type === 'del') dels.push(ops[k++].value);
		while (k < ops.length && ops[k].type === 'add') adds.push(ops[k++].value);

		// Pair each removed line with the next added line that is similar enough to be an edit of it.
		const pairOf = new Map<number, number>();
		let next = 0;
		dels.forEach((d, di) => {
			for (let ai = next; ai < adds.length; ai++) {
				if (similarity(d, adds[ai]) >= 0.4) {
					pairOf.set(di, ai);
					next = ai + 1;
					break;
				}
			}
		});
		const addSegments = new Map<number, Segment[]>();
		dels.forEach((d, di) => {
			const ai = pairOf.get(di);
			if (ai === undefined) {
				out.push({ type: 'del', oldNo: oldNo++, segments: [{ text: d, changed: false }] });
			} else {
				const seg = wordSegments(d, adds[ai]);
				out.push({ type: 'del', oldNo: oldNo++, segments: seg.del });
				addSegments.set(ai, seg.add);
			}
		});
		adds.forEach((a, ai) => {
			out.push({ type: 'add', newNo: newNo++, segments: addSegments.get(ai) ?? [{ text: a, changed: false }] });
		});
	}
	return out;
}

/** Rows for a side-by-side view: removed lines on the left, added lines on the right. */
export function toSplitRows(lines: DiffLine[]): { left?: DiffLine; right?: DiffLine }[] {
	const rows: { left?: DiffLine; right?: DiffLine }[] = [];
	for (let k = 0; k < lines.length; ) {
		if (lines[k].type === 'equal') {
			rows.push({ left: lines[k], right: lines[k] });
			k++;
			continue;
		}
		const dels: DiffLine[] = [];
		const adds: DiffLine[] = [];
		while (k < lines.length && lines[k].type === 'del') dels.push(lines[k++]);
		while (k < lines.length && lines[k].type === 'add') adds.push(lines[k++]);
		for (let p = 0; p < Math.max(dels.length, adds.length); p++) rows.push({ left: dels[p], right: adds[p] });
	}
	return rows;
}
