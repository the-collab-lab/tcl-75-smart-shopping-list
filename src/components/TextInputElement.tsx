import React from 'react';

const TextInputElement = ({
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
			/>
			<br />
		</>
	);
};

export default TextInputElement;
