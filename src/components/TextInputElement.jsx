export const TextInputElement = ({
	label,
	type,
	id,
	placeholder,
	onChange,
	required,
}) => {
	return (
		<>
			<label htmlFor={id}>{label}</label>
			<br />
			<input
				type={type}
				id={id}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
				pattern="^[^\s].+[^\s]$"
			/>
			<br />
		</>
	);
};
