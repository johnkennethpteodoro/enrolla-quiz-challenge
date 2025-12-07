"use client";
interface Props {
	question: RadioQuestion;
	value: number | null;
	onChange: (value: number) => void;
}

export default function RadioQuestion({ question, value, onChange }: Props) {
	return (
		<div className="space-y-4">
			<h1 className="text-base font-bold text-gray-900">{question.question}</h1>
			<div className="space-y-2">
				{question.choices.map((choice, index) => (
					<label
						key={index}
						className={`flex items-center space-x-3 px-3 py-2.5 border rounded-lg cursor-pointer transition-colors ${
							value === index ? "border-black bg-gray-100" : "border-gray-300"
						}`}
					>
						<input
							type="radio"
							name={question.id}
							checked={value === index}
							onChange={() => onChange(index)}
							className="w-3 h-3 accent-black"
						/>
						<span className="text-gray-700 text-sm">{choice}</span>
					</label>
				))}
			</div>
		</div>
	);
}
