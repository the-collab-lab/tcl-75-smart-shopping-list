const TextInputElement = ({ children, type, id }) => {
	return (
		<>
			<label htmlFor={id}>{children}</label>
			<br />
			<input type={type} id={id} required />
			<br />
		</>
	);
};

export default TextInputElement;
