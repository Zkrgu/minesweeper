import { replaceRows, solveBoard } from "../solver";

// const board = [
// 	[-1, -1, -1, -1, -1],
// 	[ 1,  1,  2,  2, -1],
// 	[ 0,  0,  0,  1, -1],
// ];
//
// const solution = [
// 	{
// 		mines: [1, 3],
// 		safe: [0, 2, 4],
// 	},
// ];
//
// const matrix = solveBoard(board[0].length, board.length, 3, board.flat());
// console.log(matrix.map((e) => e.join(" ")).join("\n"));
//
// const mines = [];
// const safe = [];
// for (const row of matrix) {
// 	if (row.filter((e) => e === 1).length == 2 && row[row.length - 1] == 1) {
// 		const cell = row.findIndex((n) => n == 1);
// 		mines.push(cell);
// 	} else if (
// 		row.filter((e) => e === 1).length == 1 ||
// 		(row[row.length - 1] === 0 && row.every((e) => e === 1 || e === 0))
// 	) {
// 		for (const [i, n] of row.entries()) {
// 			if (n == 1) safe.push(i);
// 		}
// 	}
// }
//
// console.log(mines, safe);

const testCases = [
	[
		[[1, 1, 0, 2]],
		[
			[1, 0, 0, 1],
			[0, 1, 0, 1],
		],
	],
	[
		[[1, -1, 0, 1]],
		[
			[0, 1, 0, 0],
			[1, 0, 0, 1],
		],
	],
	[
		[[1, -1, -1, 1]],
		[
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[1, 0, 0, 1],
		],
	],
	[
		[[1, -1, 1, 2]],
		[
			[0, 1, 0, 0],
			[1, 0, 0, 1],
			[0, 0, 1, 1],
		],
	],
	[
		[[1, 0, 1, 0]],
		[
			[1, 0, 0, 0],
			[0, 0, 1, 0],
		],
	],
];

function deepEqual<T extends number | T[]>(a: T | T[], b: T | T[]): boolean {
	if (Array.isArray(a)) {
		if (!Array.isArray(b)) return false;
		if (a.length !== b.length) return false;
		return a.every((e, i) => deepEqual(e, b[i]));
	}
	return a === b;
}

for (const [input, expected] of testCases) {
	replaceRows(input);
	const equal = deepEqual(expected, input);
	if (!equal) {
		console.error(expected, input);
	}
}
