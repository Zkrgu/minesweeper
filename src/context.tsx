import { createContext, useContext, useEffect, useState } from "react";
import {
	chordSquare,
	createBoard,
	createUserBoard,
	flagSquare,
	loseSquare,
	revealSquare,
	numberSquares,
	win,
} from "./board";
import { flagSolved, solveBoard } from "./solver";

const defaultState = {
	board: [],
	width: 8,
	height: 8,
	mineCount: 10,
	startTime: 0,
	moves: [],
	running: false,
	flags: new Set(),
	newBoard() {},
	userBoard: [],
	reveal(idx: number) {},
	flag(idx: number) {},
	chord(idx: number) {},
	solve() {},
	loadBoard() {},
};

const GameContext = createContext(defaultState);

export function GameProvider({ children }: { children: React.ReactNode }) {
	const [width, setWidth] = useState(8);
	const [height, setHeight] = useState(8);
	const [mineCount, setMineCount] = useState(10);
	const [board, setBoard] = useState(createBoard(width, height, mineCount));
	const [userBoard, setUserBoard] = useState(createUserBoard(width, height));
	const [running, setRunning] = useState(false);
	const [startTime, setStartTime] = useState(0);
	const [firstMove, setFirstMove] = useState(true);

	function solve() {
		console.log("solving");
		for (let i = 0; i < 100; ++i) {
			const [mines, safe] = solveBoard(width, height, mineCount, userBoard);
			if (mines.size == 0 && safe.size == 0) break;
			flagSolved(width, height, userBoard, board, mines, safe);
			setUserBoard([...userBoard]);
		}
	}

	function loadBoard({
		width,
		height,
		mineCount,
		board,
	}: {
		width: number;
		height: number;
		mineCount?: number;
		board?: number[];
	}) {
		console.log("loading board");
		const newBoard = board
			? [...board]
			: createBoard(width, height, mineCount!);
		console.log(width, height, newBoard);
		numberSquares(width, height, newBoard);
		setBoard(newBoard);
		setUserBoard(createUserBoard(width, height));
		setMineCount(newBoard.filter((e) => e == 9).length);
		setWidth(width);
		setHeight(height);
		setFirstMove(true);
		setStartTime(0);
	}

	function newBoard() {
		setBoard(createBoard(width, height, mineCount));
		setUserBoard(createUserBoard(width, height));
		setRunning(false);
		setFirstMove(true);
		setStartTime(0);
	}

	function startGame() {
		if (running) return;
		setRunning(true);
		setFirstMove(false);
		setStartTime(Date.now());
	}

	function reveal(idx: number) {
		if (userBoard[idx] == -2) return;
		startGame();
		revealSquare(idx, width, height, userBoard, board, firstMove);
		setUserBoard([...userBoard]);
	}

	function flag(idx: number) {
		flagSquare(idx, userBoard);
		setUserBoard([...userBoard]);
	}

	function chord(idx: number) {
		chordSquare(idx, width, height, userBoard, board);
		setUserBoard([...userBoard]);
	}

	const flags = userBoard.reduce((p, c) => p + (c === -2 ? 1 : 0), 0);

	useEffect(() => {
		if (running == false) return;
		const lost = userBoard.findIndex((e) => e === 9);
		const revealed = userBoard.reduce((p, c) => p + (c >= 0 ? 1 : 0), 0);
		if (lost !== -1) {
			setRunning(false);
			loseSquare(lost, userBoard, board);
		} else if (revealed + mineCount === width * height) {
			win(userBoard, board);
			setRunning(false);
		}
	}, [mineCount, width, height, userBoard]);

	return (
		<GameContext.Provider
			value={{
				board,
				width,
				height,
				newBoard,
				flags,
				userBoard,
				reveal,
				flag,
				running,
				startTime,
				chord,
				mineCount,
				solve,
				loadBoard,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}

export function useGame() {
	return useContext(GameContext);
}
