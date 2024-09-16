import React, { ChangeEventHandler } from 'react';

type Props = {
	label: string;
	type: string;
	id: string;
	placeholder: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	required: boolean;
};

const TextInputElement = ({
	label,
	type,
	id,
	placeholder,
	onChange,
	required,
}: Props) => {
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

export default TextInputElement;
