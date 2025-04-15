export function createBoard(width: number, height: number, minesCount: number) {
	const board = new Array(width * height).fill(0);
	const mines = new Set<number>();
	while (mines.size < minesCount) {
		mines.add(Math.floor(Math.random() * board.length));
	}
	for (const mine of mines.values()) {
		board[mine] = 9;
	}
	numberSquares(width, height, board);
	return board;
}

export function numberSquares(width: number, height: number, board: number[]) {
	board.forEach((e, i) => {
		if (e == 9) return;
		const neighMines = countNeighbours(i, width, height, board);
		board[i] = neighMines;
	});
}

export function countNeighbours(
	i: number,
	width: number,
	height: number,
	board: number[],
) {
	return getNeighbours(i, width, height).reduce(
		(p, c) => p + (board[c] == 9 ? 1 : 0),
		0,
	);
}

export function createUserBoard(height: number, width: number) {
	return new Array(width * height).fill(-1);
}

export function getNeighbours(index: number, width: number, height: number) {
	const x = index % width;
	const y = Math.floor(index / width);
	const n = [];
	for (const dx of [-1, 0, 1]) {
		const nx = x + dx;
		if (nx >= width || nx < 0) continue;
		for (const dy of [-1, 0, 1]) {
			const ny = y + dy;
			if (ny >= height || ny < 0 || (dx == 0 && dy == 0)) continue;
			n.push(nx + ny * width);
		}
	}
	return n;
}

export function revealSquare(
	index: number,
	width: number,
	height: number,
	userBoard: number[],
	board: number[],
	firstMove = false,
) {
	const queue = [index];
	const visited = new Set();
	while (queue.length > 0) {
		const item = queue.pop()!;
		if (visited.has(item)) continue;
		visited.add(item);
		console.log(board);
		if (firstMove && visited.size === 1 && board[item] === 9) {
			board[board.findIndex((e) => e !== 9)] = 9;
			board[item] = 0;
			numberSquares(width, height, board);
		}
		userBoard[item] = board[item];
		if (board[item] === 0) queue.push(...getNeighbours(item, width, height));
	}
}

export function flagSquare(index: number, userBoard: number[]) {
	userBoard[index] = userBoard[index] === -2 ? -1 : -2;
}

export function chordSquare(
	index: number,
	width: number,
	height: number,
	userBoard: number[],
	board: number[],
) {
	const count = userBoard[index];
	const neighbours = getNeighbours(index, width, height);
	const flags = neighbours.filter((n) => userBoard[n] === -2).length;
	if (count === flags)
		for (const neigh of neighbours.filter((n) => userBoard[n] !== -2)) {
			revealSquare(neigh, width, height, userBoard, board);
		}
}

export function loseSquare(
	index: number,
	userBoard: number[],
	board: number[],
) {
	board.forEach((e, i) => {
		if (e !== 9) {
			if (userBoard[i] === -2) userBoard[i] = 10;
			return;
		}
		userBoard[i] = userBoard[i] === -2 ? -2 : 9;
	});
	userBoard[index] = 11;
}

export function win(userBoard: number[], board: number[]) {
	board.forEach((e, i) => {
		if (e === 9) userBoard[i] = -2;
	});
}

export function calculate3bv(board: number[], width: number, height: number) {
	const empty = [...board.entries()]
		.filter(([i, e]) => e === 0)
		.map(([i]) => i);
	console.log(empty);
	const adj = new Set(
		empty.concat(empty.flatMap((m) => getNeighbours(m, width, height))),
	);
	const mineCount = board.reduce((p, c) => p + (c === 9 ? 1 : 0), 0);

	const visited = new Set();
	let areas = 0;
	for (const square of empty) {
		if (visited.has(square)) continue;
		const queue = [square];
		while (queue.length > 0) {
			const item = queue.pop()!;
			if (visited.has(item)) continue;
			visited.add(item);
			for (const neigh of getNeighbours(item, width, height)) {
				if (board[neigh] === 0) queue.push(neigh);
			}
		}
		++areas;
	}
	return board.length - mineCount - adj.size + areas;
}
