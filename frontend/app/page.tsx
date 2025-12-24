"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useSnapshot } from "valtio";
import { useRouter } from "next/navigation";
import { fetchQuiz, submitAnswers } from "@/lib/api";
import { store } from "./_store";
import TextQuestion from "./components/TextQuestion";
import RadioQuestion from "./components/RadioQuestion";
import CheckboxQuestion from "./components/CheckboxQuestion";
import LoadingQuiz from "./components/LoadingQuiz";
import { toast } from "sonner";
import { Send, Play, X } from "lucide-react";

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function QuizPage() {
	const router = useRouter();
	const snap = useSnapshot(store);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const handleSubmit = useCallback(
		async (isAutoSubmit = false) => {
			if (!isAutoSubmit) {
				const unanswered = store.questions.filter((q) => !(q.id in store.answers));

				if (unanswered.length > 0) {
					toast.error(
						`Please answer all questions. ${unanswered.length} question(s) remaining.`
					);
					return;
				}
			}

			try {
				store.submitting = true;

				if (timerRef.current) {
					clearInterval(timerRef.current);
				}

				const formattedAnswers: Answer[] = Object.entries(store.answers).map(
					([id, value]) => ({
						id,
						value,
					})
				);

				const result = await submitAnswers(formattedAnswers);

				sessionStorage.setItem("quizResults", JSON.stringify(result));
				sessionStorage.setItem("quizAnswers", JSON.stringify(store.answers));
				sessionStorage.setItem("quizQuestions", JSON.stringify(store.questions));
				sessionStorage.setItem(
					"quizTimeSpent",
					JSON.stringify(store.quizDuration - store.timeRemaining)
				);

				router.push("/results");
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Failed to submit quiz";
				toast.error(errorMessage);
				store.submitting = false;
			}
		},
		[router]
	);

	useEffect(() => {
		if (!store.quizStartTime || store.submitting) return;

		timerRef.current = setInterval(() => {
			const elapsed = Math.floor((Date.now() - store.quizStartTime!) / 1000);
			const remaining = Math.max(0, store.quizDuration - elapsed);

			store.timeRemaining = remaining;

			if (remaining === 0) {
				if (timerRef.current) {
					clearInterval(timerRef.current);
				}
				toast.error("Time's up! Auto-submitting your answers...");
				handleSubmit(true);
			}
		}, 1000);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [snap.quizStartTime, snap.submitting, handleSubmit]);

	useEffect(() => {
		async function loadQuiz() {
			try {
				store.loading = true;
				const data = await fetchQuiz();
				store.questions = data;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Failed to load quiz";
				toast.error(errorMessage);
			} finally {
				store.loading = false;
			}
		}

		loadQuiz();
	}, []);

	const handleAnswerChange = (questionId: string, value: string | number | number[]) => {
		store.answers = {
			...store.answers,
			[questionId]: value,
		};
	};

	const handleStartQuiz = () => {
		store.quizStartTime = Date.now();
		toast.success("Quiz started! Good luck!");
	};

	const handleSubmitClick = () => {
		const unanswered = store.questions.filter((q) => !(q.id in store.answers));

		if (unanswered.length > 0) {
			toast.error(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
			return;
		}

		setShowConfirmModal(true);
	};

	const handleConfirmSubmit = () => {
		setShowConfirmModal(false);
		handleSubmit(false);
	};

	if (snap.loading) {
		return <LoadingQuiz />;
	}

	if (!snap.loading && snap.questions.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center px-4">
				<div className=" p-8 max-w-md text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">No Quiz Available</h2>
					<p className="text-gray-600 mb-6">
						Unable to load quiz questions. Please try again later.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-black text-white py-3 px-5 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-colors font-medium"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!snap.quizStartTime) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center px-4">
				<div className="p-8 max-w-md text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Full-Stack Developer Quiz
					</h2>
					<p className="text-gray-600 mb-6">
						You have {Math.floor(store.quizDuration / 60)} minutes to complete{" "}
						{snap.questions.length} questions.
						<br />
						Once you start, the timer cannot be paused.
					</p>
					<button
						onClick={handleStartQuiz}
						className="bg-black text-white py-3 px-6 rounded-lg text-base cursor-pointer hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
					>
						<Play size={18} />
						Start Quiz
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br bg-white py-12 px-4">
			<div className="max-w-3xl mx-auto">
				<div className="mb-8 mt-5">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-gray-900">
							Full-Stack Developer Quiz
						</h1>

						<div
							className={` rounded-xl text-base font-bold ${
								snap.timeRemaining < 30
									? "text-red-600 animate-pulse"
									: "text-black "
							}`}
						>
							{formatTime(snap.timeRemaining)}
						</div>
					</div>

					<p className="text-gray-600 text-sm">
						Answer all {snap.questions.length} questions to test your knowledge!
					</p>

					<div className="mt-4 flex items-center space-x-2">
						<div className="flex-1 bg-gray-200 rounded-full h-2">
							<div
								className="bg-black h-2 rounded-full transition-all duration-300"
								style={{
									width: `${
										(Object.keys(snap.answers).length / snap.questions.length) *
										100
									}%`,
								}}
							></div>
						</div>
						<span className="text-sm text-gray-600 font-medium">
							{Object.keys(snap.answers).length}/{snap.questions.length}
						</span>
					</div>
				</div>

				<div className="space-y-2">
					{snap.questions.map((question) => (
						<div key={question.id} className="p-6">
							{question.type === "text" && (
								<TextQuestion
									question={question as TextQuestion}
									value={(snap.answers[question.id] as string) || ""}
									onChange={(value) => handleAnswerChange(question.id, value)}
								/>
							)}

							{question.type === "radio" && (
								<RadioQuestion
									question={question as RadioQuestion}
									value={(snap.answers[question.id] as number) ?? null}
									onChange={(value) => handleAnswerChange(question.id, value)}
								/>
							)}

							{question.type === "checkbox" && (
								<CheckboxQuestion
									question={question as CheckboxQuestion}
									value={[...((snap.answers[question.id] as number[]) || [])]}
									onChange={(value) => handleAnswerChange(question.id, value)}
								/>
							)}
						</div>
					))}
				</div>

				<div className="p-6 flex justify-end">
					<button
						onClick={handleSubmitClick}
						disabled={
							snap.submitting ||
							Object.keys(snap.answers).length !== snap.questions.length
						}
						className="bg-black text-white text-sm py-3 px-5 rounded-lg font-semibold cursor-pointer hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
					>
						<Send size={14} />
						{snap.submitting ? "Submitting..." : "Submit Quiz"}
					</button>
				</div>
			</div>

			{showConfirmModal && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full">
						<div className="flex justify-between items-start mb-4">
							<h3 className="text-xl font-bold text-gray-900">Submit Quiz?</h3>
							<button
								onClick={() => setShowConfirmModal(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								<X size={20} />
							</button>
						</div>
						<p className="text-gray-600 mb-6">
							Are you sure you want to submit your quiz? You won't be able to change
							your answers after submission.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowConfirmModal(false)}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmSubmit}
								className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-700 transition-colors"
							>
								Submit Quiz
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
