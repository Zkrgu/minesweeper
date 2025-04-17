import { getNeighbours } from "../board";

export function gaussEliminationSolver(
	width: number,
	height: number,
	mineCount: number,
	userBoard: number[],
) {
	const matrix = buildMatrix(width, height, mineCount, userBoard);
	gaussEliminate(matrix);
	return cellsFromMatrix(matrix);
}

function buildMatrix(
	width: number,
	height: number,
	mineCount: number,
	userBoard: number[],
) {
	const hidden = [...userBoard.entries()].filter(([, e]) => e == -1);
	const flagCount = userBoard.filter((e) => e == -2 || e == -3).length;
	const matrix = [...userBoard.entries()]
		.filter(([, e]) => e > 0)
		.map(([i, e]) => {
			const row = new Array(userBoard.length).fill(0);
			let n = e;
			const possible = [];
			for (const neigh of getNeighbours(i, width, height)) {
				if (userBoard[neigh] === -2 || userBoard[neigh] == -3) --n;
				else if (userBoard[neigh] == -1) {
					possible.push(neigh);
					row[neigh] = 1;
				}
			}
			if (row.reduce((p, c) => p + c, 0) == 0) return;
			row.push(n);
			return row;
		})
		.filter((e) => Array.isArray(e));
	const allMines = new Array(userBoard.length).fill(0);
	for (const [i] of hidden) {
		allMines[i] = 1;
	}
	allMines.push(mineCount - flagCount);
	matrix.push(allMines);

	return matrix;
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
			}
			++h;
			++k;
			replaceRows(matrix);
		}
	}
}

function replaceRows(matrix: number[][]) {
	let newRows = [];
	let toRemove = [];
	for (const [index, row] of matrix.entries()) {
		if (row[row.length - 1] < 0) row.forEach((e, i) => (row[i] = -e));
		const sum = row[row.length - 1];
		const parts = row.slice(0, -1);
		const partsOneOrZero = parts.every((i) => i === 1 || i === 0);
		const rowSum = parts.reduce((p, c) => p + (c === 1 ? 1 : 0), 0);
		if (sum == 0 && partsOneOrZero) {
			toRemove.push(index);
			newRows.push(
				...parts
					.map((e, i) => (e === 1 ? i : -1))
					.filter((e) => e != -1)
					.map((e) => {
						const r = new Array(row.length).fill(0);
						r[e] = 1;
						return r;
					}),
			);
		}
		if (rowSum === sum && (sum > 1 || (sum == 1 && !partsOneOrZero))) {
			toRemove.push(index);
			newRows.push(
				...parts
					.map((e, i) => (e === 1 ? i : -1))
					.filter((e) => e != -1)
					.map((e) => {
						const r = new Array(row.length).fill(0);
						r[e] = 1;
						r[r.length - 1] = 1;
						return r;
					}),
				...parts
					.map((e, i) => (e === -1 ? i : -1))
					.filter((e) => e != -1)
					.map((e) => {
						const r = new Array(row.length).fill(0);
						r[e] = 1;
						r[r.length - 1] = 0;
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

function cellsFromMatrix(matrix: number[][]) {
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
