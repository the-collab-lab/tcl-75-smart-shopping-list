export const RadioInputElement = ({
	label,
	id,
	value,
	required,
}: {
	label: string;
	id: string;
	value: number;
	required: boolean;
}) => {
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
