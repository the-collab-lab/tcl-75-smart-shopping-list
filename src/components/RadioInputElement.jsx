export const RadioInputElement = ({ label, id, value, required }) => {
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
