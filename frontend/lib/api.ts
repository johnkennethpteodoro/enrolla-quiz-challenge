export async function fetchQuiz(): Promise<Question[]> {
	const response = await fetch("/api/quiz");

	if (!response.ok) {
		throw new Error("Failed to fetch quiz");
	}

	return response.json();
}

export async function submitAnswers(answers: Answer[]): Promise<GradeResponse> {
	const response = await fetch("/api/grade", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ answers }),
	});

	if (!response.ok) {
		throw new Error("Failed to submit answers");
	}

	return response.json();
}
