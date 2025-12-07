interface Answer {
	id: string | number;
	value: string | number | number[];
}

export interface GradeRequest {
	answers: Answer[];
}

export type Bindings = {};
