import { ChangeEventHandler } from 'react';

export const TextInputElement = ({
	label,
	type,
	id,
	placeholder,
	onChange,
	required,
}: {
	label: string;
	type: string;
	id: string;
	placeholder: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	required: boolean;
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
