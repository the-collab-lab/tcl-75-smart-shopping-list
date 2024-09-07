const TextInputElement = ({ children, type, id, placeholder, onChange }) => {
	return (
		<>
			<label htmlFor={id}>{children}</label>
			<br />
			<input
				type={type}
				id={id}
				placeholder={placeholder}
				onChange={onChange}
				required
			/>
			<br />
		</>
	);
};

export default TextInputElement;
