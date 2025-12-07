"use client";
interface Props {
	question: TextQuestion;
	value: string;
	onChange: (value: string) => void;
}

export default function TextQuestion({ question, value, onChange }: Props) {
	return (
		<div className="space-y-4">
			<h1 className="text-base font-bold text-gray-900">{question.question}</h1>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm"
				placeholder="Type your answer..."
			/>
		</div>
	);
}
