import { proxy } from "valtio";

interface Store {
	questions: Question[];
	answers: Record<string, string | number | number[]>;
	loading: boolean;
	submitting: boolean;
	timeRemaining: number;
	quizStartTime: number | null;
	quizDuration: number;
	results: GradeResponse | null;
	timeSpent: number;
}

const store = proxy<Store>({
	questions: [],
	answers: {},
	loading: true,
	submitting: false,
	quizDuration: 30 * 60,
	timeRemaining: 30 * 60,
	quizStartTime: null,
	results: null,
	timeSpent: 0,
});

export { store };
