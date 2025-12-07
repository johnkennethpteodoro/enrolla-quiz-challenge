import { Question } from "../types/question";

export const questions: Question[] = [
	{
		id: "1",
		type: "radio",
		question: "What does API stand for?",
		choices: [
			"Application Programming Interface",
			"Advanced Programming Integration",
			"Automated Process Integration",
			"Application Process Interface",
		],
		correctIndex: 0,
	},
	{
		id: "2",
		type: "checkbox",
		question: "Which of these are JavaScript frameworks? (Select all that apply)",
		choices: ["React", "Django", "Vue", "Flask", "Angular"],
		correctIndexes: [0, 2, 4],
	},
	{
		id: "3",
		type: "text",
		question: "What is the default port for HTTP?",
		correctText: "80",
	},
	{
		id: "4",
		type: "radio",
		question: "Which HTTP method is used to update a resource?",
		choices: ["GET", "POST", "PUT", "DELETE"],
		correctIndex: 2,
	},
	{
		id: "5",
		type: "checkbox",
		question: "Which of these are CSS preprocessors?",
		choices: ["SASS", "Bootstrap", "LESS", "Tailwind", "Stylus"],
		correctIndexes: [0, 2, 4],
	},
	{
		id: "6",
		type: "text",
		question: "What does CSS stand for? (Write the full form)",
		correctText: "Cascading Style Sheets",
	},
	{
		id: "7",
		type: "radio",
		question: "Which company developed TypeScript?",
		choices: ["Google", "Facebook", "Microsoft", "Apple"],
		correctIndex: 2,
	},
	{
		id: "8",
		type: "checkbox",
		question: "Which of these are valid HTTP status codes?",
		choices: ["200", "404", "999", "500", "301"],
		correctIndexes: [0, 1, 3, 4],
	},
	{
		id: "9",
		type: "text",
		question: "What does JSON stand for?",
		correctText: "JavaScript Object Notation",
	},
	{
		id: "10",
		type: "radio",
		question: "Which of these is NOT a JavaScript runtime?",
		choices: ["Node.js", "Deno", "Bun", "Python"],
		correctIndex: 3,
	},
];
