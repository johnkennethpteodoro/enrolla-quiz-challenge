"use client";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useRouter } from "next/navigation";
import { store } from "../_store";
import { RotateCw } from "lucide-react";
import LoadingQuiz from "../components/LoadingQuiz";

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}m ${secs}s`;
}

export default function ResultsPage() {
	const router = useRouter();
	const snap = useSnapshot(store);

	useEffect(() => {
		const resultsData = sessionStorage.getItem("quizResults");
		const questionsData = sessionStorage.getItem("quizQuestions");
		const answersData = sessionStorage.getItem("quizAnswers");
		const timeData = sessionStorage.getItem("quizTimeSpent");

		if (!resultsData || !questionsData || !answersData) {
			router.push("/");
			return;
		}

		store.results = JSON.parse(resultsData);
		store.questions = JSON.parse(questionsData);
		store.answers = JSON.parse(answersData);
		store.timeSpent = timeData ? JSON.parse(timeData) : 0;
	}, [router]);

	const handleRetake = () => {
		sessionStorage.removeItem("quizResults");
		sessionStorage.removeItem("quizQuestions");
		sessionStorage.removeItem("quizAnswers");
		sessionStorage.removeItem("quizTimeSpent");

		store.results = null;
		store.questions = [];
		store.answers = {};
		store.timeSpent = 0;
		store.loading = true;
		store.submitting = false;
		store.timeRemaining = store.quizDuration;
		store.quizStartTime = null;

		router.push("/");
	};

	if (!snap.results) {
		return <LoadingQuiz />;
	}

	const percentage = Math.round((snap.results.score / snap.results.total) * 100);

	return (
		<div className="min-h-screen bg-white to-indigo-100 py-12 px-4">
			<div className="max-w-3xl mx-auto">
				<div className="mb-10 text-center">
					<div className="flex items-center justify-start space-x-2 mb-2 text-4xl">
						<div className="text-black">
							{snap.results.score}/{snap.results.total}
						</div>
						<div className="text-black">-</div>
						<div className="f text-black">{percentage}%</div>
					</div>

					{/* Timer Display */}
					<div className="flex items-center justify-start gap-2 mb-4">
						<span className="text-gray-600 text-xs font-medium">
							Time spent:{" "}
							<span className="text-black font-semibold">
								{formatTime(snap.timeSpent)}
							</span>
						</span>
					</div>

					<div className="w-full bg-gray-200 rounded-full h-2 mb-5">
						<div
							className="h-2 rounded-full transition-all duration-500 bg-black"
							style={{ width: `${percentage}%` }}
						></div>
					</div>

					<div className="flex justify-end">
						<button
							onClick={handleRetake}
							className="bg-black text-white cursor-pointer shadow-lg py-3 px-5 text-sm rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
						>
							<RotateCw size={14} strokeWidth={3} />
							Retake Quiz
						</button>
					</div>
				</div>

				<div className="space-y-5">
					<h2 className="text-lg font-bold text-gray-900 mb-4">Question Review</h2>
					{snap.questions.map((question) => {
						const result = snap.results!.results.find((r) => r.id === question.id);
						const isCorrect = result?.correct;

						return (
							<div
								key={question.id}
								className={`p-6 rounded-2xl border " ${
									isCorrect
										? " bg-green-50/20 border-green-600/20"
										: " bg-red-50/20 border-red-600/20"
								}`}
							>
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center space-x-3">
										<span
											className={`font-semibold text-sm ${
												isCorrect ? "text-green-600" : "text-red-600"
											}`}
										>
											{isCorrect ? "✓ Correct" : "✗ Incorrect"}
										</span>
									</div>
								</div>
								<p className="text-gray-900 text-sm mb-1">{question.question}</p>
								<p className="text-sm text-gray-400">
									<span className="font-medium">Your answer:</span>{" "}
									{formatAnswer(question as Question, snap.answers[question.id])}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function formatAnswer(question: Question, answer: any): string {
	if (question.type === "text") {
		return answer || "No answer";
	}
	if (question.type === "radio") {
		return question.choices[answer] || "No answer";
	}
	if (question.type === "checkbox") {
		if (!answer || answer.length === 0) return "No answer";
		return answer.map((i: number) => question.choices[i]).join(", ");
	}
	return "Unknown";
}
