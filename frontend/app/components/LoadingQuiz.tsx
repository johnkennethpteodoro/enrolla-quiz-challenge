export default function LoadingQuiz() {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-10 w-10 border-b-4 border-black mx-auto"></div>
				<p className="mt-4 text-gray-600 text-lg">Loading quiz...</p>
			</div>
		</div>
	);
}
