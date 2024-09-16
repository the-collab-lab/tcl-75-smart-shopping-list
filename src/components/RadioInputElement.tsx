type Props = {
	label: string;
	id: string;
	value: number;
	required: boolean;
};

const RadioInputElement = ({ label, id, value, required }: Props) => {
	return (
		<>
			<input
				type="radio"
				name="purchase-date"
				id={id}
				value={value}
				required={required}
			/>
			<label htmlFor={id}>{label}</label>
			<br />
		</>
	);
};

export default RadioInputElement;
