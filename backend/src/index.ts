import { Hono } from "hono";
import { cors } from "hono/cors";
import { questions, type Question } from "./data/questions";

type Bindings = {
	// Add any environment variables here if needed
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes
app.use("/*", cors());

// GET /api/quiz - Return quiz questions
app.get("/api/quiz", (c) => {
	try {
		// Remove correct answers from response
		const quizQuestions = questions.map((q) => {
			const { correctText, correctIndex, correctIndexes, ...rest } = q as any;
			return rest;
		});

		return c.json(quizQuestions);
	} catch (error) {
		return c.json({ error: "Failed to fetch quiz questions" }, 500);
	}
});

// Answer type for grading
interface Answer {
	id: string | number;
	value: string | number | number[];
}

interface GradeRequest {
	answers: Answer[];
}

// POST /api/grade - Grade the quiz
app.post("/api/grade", async (c) => {
	try {
		const body = await c.req.json<GradeRequest>();

		// Validate request body
		if (!body.answers || !Array.isArray(body.answers)) {
			return c.json({ error: "Invalid request: answers must be an array" }, 400);
		}

		let score = 0;
		const results: Array<{ id: string | number; correct: boolean }> = [];

		// Grade each answer
		for (const answer of body.answers) {
			const question = questions.find((q) => q.id === String(answer.id));

			if (!question) {
				results.push({ id: answer.id, correct: false });
				continue;
			}

			let isCorrect = false;

			switch (question.type) {
				case "text": {
					const userAnswer = String(answer.value).trim().toLowerCase();
					const correctAnswer = question.correctText.trim().toLowerCase();
					isCorrect = userAnswer === correctAnswer;
					break;
				}
				case "radio": {
					isCorrect = Number(answer.value) === question.correctIndex;
					break;
				}
				case "checkbox": {
					const userAnswers = Array.isArray(answer.value)
						? answer.value.map(Number).sort()
						: [];
					const correctAnswers = [...question.correctIndexes].sort();
					isCorrect =
						userAnswers.length === correctAnswers.length &&
						userAnswers.every((val, idx) => val === correctAnswers[idx]);
					break;
				}
			}

			if (isCorrect) score++;
			results.push({ id: answer.id, correct: isCorrect });
		}

		return c.json({
			score,
			total: questions.length,
			results,
		});
	} catch (error) {
		return c.json({ error: "Invalid request payload" }, 400);
	}
});

// Health check endpoint
app.get("/", (c) => {
	return c.json({ message: "Quiz API is running!" });
});

export default app;
