import { flagSquare, revealSquare } from "./board";
import { entropySolver } from "./solver/entropy";
import { gaussEliminationSolver } from "./solver/gaussEliminate";
import { trivialSolver } from "./solver/trivial";

export function solveBoard(
	solver: "trivial" | "gauss" | "entropy",
	width: number,
	height: number,
	mineCount: number,
	userBoard: number[],
) {
	switch (solver) {
		case "trivial":
			return trivialSolver(width, height, userBoard);
		case "gauss":
			return gaussEliminationSolver(width, height, mineCount, userBoard);
		case "entropy":
			return entropySolver(width, height, mineCount, userBoard);
		default:
			return [new Set<number>(), new Set<number>()];
	}
}

export function resetSolved(userBoard: number[]) {
	for (const cell of userBoard
		.map((e, i) => (e < -2 ? i : 0))
		.filter(Boolean)) {
		userBoard[cell] = -1;
	}
}

export function highlightSolved(
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
		userBoard[cell] = -3;
	}
	for (const cell of safe) {
		if (userBoard[cell] === -1) userBoard[cell] = -4;
	}
}
