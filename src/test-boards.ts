export const boardPresets = [
	{
		name: "Beginner",
		width: 8,
		height: 8,
		mineCount: 10,
	},
	{
		name: "Intermediate",
		width: 16,
		height: 16,
		mineCount: 40,
	},
	{
		name: "Expert",
		width: 30,
		height: 16,
		mineCount: 99,
	},
	{
		name: "1-1-1",
		width: 3,
		height: 3,
		board: [0, 9, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		name: "1-2-1",
		width: 3,
		height: 3,
		board: [9, 0, 9, 0, 0, 0, 0, 0, 0],
	},
	{
		name: "1-2-2-1",
		width: 4,
		height: 3,
		board: [0, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	},
	{
		name: "1-2-1 Corner",
		width: 3,
		height: 3,
		board: [9, 0, 0, 0, 0, 0, 0, 0, 9],
	},
	{
		name: "2-3-1 Corner",
		width: 3,
		height: 3,
		board: [9, 9, 0, 0, 0, 0, 0, 0, 9],
	},
	{
		name: "1-3-1 Corner",
		width: 6,
		height: 5,
		board: [
			9, 9, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0,
			0, 0, 0, 0, 0,
		],
	},
];
