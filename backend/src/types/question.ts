export interface TextQuestion {
	id: string;
	type: "text";
	question: string;
	correctText: string;
}

export interface RadioQuestion {
	id: string;
	type: "radio";
	question: string;
	choices: string[];
	correctIndex: number;
}

export interface CheckboxQuestion {
	id: string;
	type: "checkbox";
	question: string;
	choices: string[];
	correctIndexes: number[];
}

export type Question = TextQuestion | RadioQuestion | CheckboxQuestion;
