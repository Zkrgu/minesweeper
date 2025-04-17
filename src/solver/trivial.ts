import { getNeighbours } from "../board";

export function trivialSolver(
	width: number,
	height: number,
	userBoard: number[],
): [Set<number>, Set<number>] {
	const mines: number[] = [];
	const safe: number[] = [];
	[...userBoard.entries()]
		.filter(([, e]) => e > 0)
		.flatMap(([i, e]) => {
			let n = e;
			const possible = [];
			for (const neigh of getNeighbours(i, width, height)) {
				if (userBoard[neigh] === -2 || userBoard[neigh] === -3) --n;
				else if (userBoard[neigh] < 0) {
					possible.push(neigh);
				}
			}
			if (n == 0) safe.push(...possible);
			else if (n == possible.length) mines.push(...possible);
		});
	return [new Set(mines), new Set(safe)];
}
