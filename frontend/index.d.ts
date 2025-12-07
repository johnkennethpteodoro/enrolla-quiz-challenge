interface TextQuestion {
	id: string;
	type: "text";
	question: string;
	_originalId?: number;
}

interface RadioQuestion {
	id: string;
	type: "radio";
	question: string;
	choices: string[];
	_originalId?: number;
	_choiceMapping?: number[];
}

interface CheckboxQuestion {
	id: string;
	type: "checkbox";
	question: string;
	choices: string[];
	_originalId?: number;
	_choiceMapping?: number[];
}

type Question = TextQuestion | RadioQuestion | CheckboxQuestion;

interface Answer {
	id: string | number;
	value: string | number | number[];
}

interface GradeResponse {
	score: number;
	total: number;
	results: Array<{
		id: string | number;
		correct: boolean;
		question?: string;
	}>;
}

// API Response types
interface QuizResponse {
	questions: Question[];
	seed: number;
}
