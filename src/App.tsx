import { useEffect, useRef, useState } from "react";
import Tile1 from "./assets/tile-1.svg?react";
import Tile2 from "./assets/tile-2.svg?react";
import Tile3 from "./assets/tile-3.svg?react";
import Tile4 from "./assets/tile-4.svg?react";
import Tile5 from "./assets/tile-5.svg?react";
import Tile6 from "./assets/tile-6.svg?react";
import Tile7 from "./assets/tile-7.svg?react";
import Tile8 from "./assets/tile-8.svg?react";
import Full from "./assets/full-digit.svg?react";
import Smile from "./assets/smile.svg?react";
import Mine from "./assets/mine.svg?react";
import Flag from "./assets/flag.svg?react";
import Sunglasses from "./assets/sunglasses.svg?react";
import NotMine from "./assets/not-mine.svg?react";
import "./App.css";
import { GameProvider, useGame } from "./context";
import { boardPresets as testBoards } from "./test-boards";

function App() {
	return (
		<GameProvider>
			<div className="border outer-border">
				<div className="game-border">
					<Header />
					<Divider />
					<Board />
				</div>
			</div>
			<TestBoardLoader />
			<SolveButton />
		</GameProvider>
	);
}

function TestBoardLoader() {
	const { loadBoard } = useGame();

	return (
		<select onChange={(ev) => loadBoard(testBoards.at(+ev.target.value))}>
			{testBoards.map((tb, i) => (
				<option value={i}>{tb.name}</option>
			))}
		</select>
	);
}

function SolveButton() {
	const { solve } = useGame();
	return <button onClick={() => solve()}>solve</button>;
}

function Header() {
	return (
		<div className="header border-inverse">
			<MineCounter />
			<Restart />
			<Timer />
		</div>
	);
}

function MineCounter() {
	const { mineCount, flags } = useGame();
	return <Counter digits={3} count={mineCount - flags} />;
}

function Divider() {
	return <div className="divider" />;
}

function Restart() {
	const { newBoard } = useGame();
	return (
		<div onClick={newBoard} className="restart border">
			<Smile />
		</div>
	);
}

function Timer() {
	const [time, setTime] = useState(0);
	const { startTime, running } = useGame();
	const animationFrame = useRef(0);

	const updateTime = () => {
		const newTime = Date.now();
		setTime(newTime - startTime);
	};

	useEffect(() => {
		if (!running) {
			return;
		}
		animationFrame.current = requestAnimationFrame(updateTime);
		return () => cancelAnimationFrame(animationFrame.current);
	}, [time, running]);

	return <Counter digits={3} count={Math.floor(time / 1000)} />;
}

function Counter({ digits, count }: { digits: number; count: number }) {
	const capped = Math.max(
		Math.min(10 ** digits - 1, count),
		-(10 ** (digits - 1) - 1),
	);
	const digs = capped
		.toString()
		.padStart(digits, "0")
		.replace("0-", "-0")
		.split("");

	return (
		<div className="timer border-inverse border-thin">
			{digs.map((e, i, a) => (
				<div key={a.length - i} className={`digit d${e}`}>
					<Full />
				</div>
			))}
		</div>
	);
}

function Board() {
	const { width, height, userBoard } = useGame();
	return (
		<div className="board border-inverse">
			{new Array(height).fill(0).map((_, i) => (
				<div style={{ display: "flex" }} key={i}>
					{new Array(width).fill(0).map((_, j) => (
						<Square
							index={i * width + j}
							num={userBoard[i * width + j]}
							key={j}
						/>
					))}
				</div>
			))}
		</div>
	);
}

function Square({ index, num }: { index: number; num: number }) {
	if (num >= 0) return <RevealedSquare index={index} mines={num} />;

	const { reveal, flag } = useGame();

	function handleContextMenu(ev) {
		ev.preventDefault();
		flag(index);
	}

	return (
		<div
			className="cell border"
			onClick={() => reveal(index)}
			onContextMenu={(ev) => handleContextMenu(ev)}
			style={{
				position: "relative",
				backgroundColor: num === -3 ? "coral" : num === -4 ? "aquamarine" : "",
			}}
		>
			{num == -2 && (
				<Flag style={{ position: "absolute", top: -2, left: -2 }} />
			)}
		</div>
	);
}

const tiles = [
	Tile1,
	Tile2,
	Tile3,
	Tile4,
	Tile5,
	Tile6,
	Tile7,
	Tile8,
	Mine,
	NotMine,
	Mine,
];

function RevealedSquare({ index, mines }: { index: number; mines: number }) {
	const { chord } = useGame();
	const Number = tiles[mines - 1];

	function handleContextMenu(ev: React.MouseEvent) {
		ev.preventDefault();
		chord();
	}

	return (
		<div
			onClick={() => chord(index)}
			onContextMenu={(ev) => handleContextMenu(ev)}
			className="cell"
			style={{
				backgroundColor: "#c6c6c6",
				boxShadow: "1px 1px inset #808080",
			}}
		>
			{mines > 0 && (
				<Number
					style={{
						position: "absolute",
						backgroundColor: mines === 11 ? "red" : "",
					}}
				/>
			)}
		</div>
	);
}

export default App;
