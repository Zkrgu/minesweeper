import { flagSquare, getNeighbours, revealSquare } from "./board";

export function solveBoard(
	width: number,
	height: number,
	mineCount: number,
	userBoard: number[],
) {
	const [trivalMine, trivialSafe] = trivialSolver(width, height, userBoard);
	if (trivalMine.size > 0 || trivialSafe.size > 0)
		return [trivalMine, trivialSafe];
	const matrix = buildMatrix(width, height, mineCount, userBoard);
	for (let i = 0; i < 1; ++i) {
		gaussEliminate(matrix);
		replaceRows(matrix);
	}
	return cellsFromMatrix(matrix);
}

export function buildMatrix(
	width: number,
	height: number,
	mineCount: number,
	userBoard: number[],
) {
	const hidden = [...userBoard.entries()].filter(([, e]) => e > 0 && e !== -2);
	const matrix = [...userBoard.entries()]
		.filter(([, e]) => e > 0)
		.map(([i, e]) => {
			const row = new Array(userBoard.length).fill(0);
			let n = e;
			const possible = [];
			for (const neigh of getNeighbours(i, width, height)) {
				if (userBoard[neigh] === -2) --n;
				else if (userBoard[neigh] < 0) {
					possible.push(neigh);
					row[neigh] = 1;
				}
			}
			if (row.reduce((p, c) => p + c, 0) == 0) return;
			row.push(n);
			return row;
		})
		.filter((e) => Array.isArray(e));
	const allMines = new Array(userBoard.length).fill(1);
	for (const [i] of hidden) {
		allMines[i] = 0;
	}
	allMines.push(mineCount);
	matrix.push(allMines);
	console.log(matrix.map((e) => e.join(" ")).join("\n"));

	return matrix;
}

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
				if (userBoard[neigh] === -2) --n;
				else if (userBoard[neigh] < 0) {
					possible.push(neigh);
				}
			}
			if (n == 0) safe.push(...possible);
			else if (n == possible.length) mines.push(...possible);
		});
	return [new Set(mines), new Set(safe)];
}

export function cellsFromMatrix(matrix: number[][]) {
	const mines = [];
	const safe = [];
	for (const row of matrix) {
		const cell = row.findIndex((n) => n == 1);
		if (row.filter((e) => e === 1).length == 2 && row[row.length - 1] == 1) {
			mines.push(cell);
		} else if (
			row.filter((e) => e === 1).length == 1 &&
			row.filter((e) => e === -1).length == 0
		) {
			safe.push(cell);
		}
	}

	return [new Set(mines), new Set(safe)];
}

export function gaussEliminate(matrix: number[][]) {
	let h = 0;
	let k = 0;
	while (h < matrix.length && k < matrix[0].length - 1) {
		// Find pivot
		let imax = -1;
		let max = 0;
		for (let i = h; i < matrix.length; ++i) {
			const val = Math.abs(matrix[i][k]);
			if (val > max) {
				imax = i;
				max = val;
			}
		}
		// No pivot
		if (imax === -1) {
			++k;
		} else {
			// Eliminate
			let tmp = matrix[h];
			matrix[h] = matrix[imax];
			matrix[imax] = tmp;
			for (let i = 0; i < matrix.length; ++i) {
				if (i == h) continue;
				const f = matrix[i][k] / matrix[h][k];
				matrix[i][k] = 0;
				for (let j = k + 1; j < matrix[0].length; ++j) {
					matrix[i][j] = matrix[i][j] - matrix[h][j] * f;
				}
				// console.log(i, f);
				console.log(matrix.map((e) => e.join("\t")).join("\n"));
			}
			++h;
			++k;
		}
	}
}

export function flagSolved(
	width: number,
	height: number,
	userBoard: number[],
	board: number[],
	mines: Iterable<number>,
	safe: Iterable<number>,
) {
	for (const cell of userBoard
		.map((e, i) => (e < -2 ? i : 0))
		.filter(Boolean)) {
		userBoard[cell] = -1;
	}
	for (const cell of mines) {
		userBoard[cell] = -2;
	}
	for (const cell of safe) {
		// if (userBoard[cell] == -1) userBoard[cell] = -4;
		// console.log(cell);
		if (userBoard[cell] === -1)
			revealSquare(cell, width, height, userBoard, board);
	}
}

export function replaceRows(matrix: number[][]) {
	// const replacements = [
	// 	[[1,1],0],
	// 	[[-1,1],0],
	// ]
	let newRows = [];
	let toRemove = [];
	for (const [index, row] of matrix.entries()) {
		if (row[row.length - 1] < 0) row.forEach((e, i) => (row[i] = -e));
		const sum = row[row.length - 1];
		const parts = row.slice(0, -1);
		const partsOneOrZero = parts.every((i) => i === 1 || i === 0);
		// const partsNegOneOrZero = parts.every((i) => i === -1 || i === 0);
		const rowSum = parts.reduce((p, c) => p + (c === 1 ? 1 : 0), 0);
		// const invRowSum = parts.reduce((p, c) => p + (c === -1 ? 1 : 0), 0);
		console.log(sum, rowSum);
		if (sum == 0 && partsOneOrZero) {
			console.log("Pattern 1");
			console.log(row);
			toRemove.push(index);
			newRows.push(
				...parts
					.map((e, i) => (e === 1 ? i : -1))
					.filter((e) => e != -1)
					.map((e) => {
						const r = new Array(row.length).fill(0);
						r[e] = 1;
						r[r.length - 1] = 0;
						return r;
					}),
			);
		}
		if (rowSum === sum && (sum > 1 || (sum == 1 && !partsOneOrZero))) {
			console.log("Pattern 2");
			console.log(row);
			toRemove.push(index);
			newRows.push(
				...parts
					.map((e, i) => (e === -1 ? i : -1))
					.filter((e) => e != -1)
					.map((e) => {
						const r = new Array(row.length).fill(0);
						r[e] = 1;
						r[r.length - 1] = 0;
						return r;
					}),
				...parts
					.map((e, i) => (e === 1 ? i : -1))
					.filter((e) => e != -1)
					.map((e) => {
						const r = new Array(row.length).fill(0);
						r[e] = 1;
						r[r.length - 1] = 1;
						return r;
					}),
			);
		}
	}
	matrix.push(...newRows);
	for (const index of toRemove.reverse()) {
		matrix.splice(index, 1);
	}
}
