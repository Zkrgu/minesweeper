import { getNeighbours } from "../board";

export function entropySolver(
	width: number,
	height: number,
	mineCount: number,
	userBoard: number[],
) {
	const mines = new Set<number>();
	const safe = new Set<number>();
	const probabilities = getProbabilities(width, height, mineCount, userBoard);
	console.log(probabilities);
	for (const [index, chance] of probabilities.entries()) {
		if (chance > 1 - 0.01) {
			mines.add(index);
		} else if (chance < 0.01) {
			safe.add(index);
		}
	}
	console.log(mines, safe);

	return [mines, safe];
}

export function getProbabilities(
	width: number,
	height: number,
	mineCount: number,
	userBoard: number[],
) {
	const decided = [...userBoard.entries()].filter(
		([, e]) => e >= 0 || e == -2 || e == -3,
	);
	const flags = userBoard.reduce(
		(p, c) => p + (c === -2 || c === -3 ? 1 : 0),
		0,
	);
	const p = userBoard.map((e) => {
		if (e >= 0) return 0;
		if (e === -2 || e === -3) return 1;
		return (mineCount - flags) / (width * height - decided.length);
	});

	const filtered: [number[], number][] = [...userBoard.entries()]
		.filter(([, e]) => e > 0)
		.map(([i, e]) => {
			let n = e;
			const possible = [];
			for (const neigh of getNeighbours(i, width, height)) {
				if (userBoard[neigh] === -2 || userBoard[neigh] === -3) --n;
				else if (userBoard[neigh] === -1 || userBoard[neigh] === -4) {
					possible.push(neigh);
				}
			}
			return [possible, n];
		});

	// Try to make it converge
	for (let i = 0; i < 1000000; ++i) {
		let changed = false;
		for (const [terms, n] of filtered) {
			const sum = terms.reduce((a, c) => a + p[c], 0);
			if (Math.abs(sum - n) > 0.001) {
				changed = true;
				const factor = n / sum;
				for (const term of terms) {
					p[term] *= factor;
					if (p[term] > 1) p[term] = 1;
				}
			}
		}
		if (!changed) break;
	}
	const allModified = new Set(filtered.flatMap((e) => e[0]));
	const modifiedSum = [...allModified].reduce((a, c) => a + p[c], 0);
	const modMask = new Array(p.length).fill(1);
	for (const n of allModified) {
		modMask[n] = 0;
	}
	for (const [n] of decided) {
		modMask[n] = 0;
	}
	const unmodProb =
		(mineCount - modifiedSum - flags) /
		(p.length - allModified.size - decided.length);
	for (const [index, value] of modMask.entries()) {
		if (value && p[index] != 1 && p[index] != 0) p[index] = unmodProb;
	}

	return p;
}
