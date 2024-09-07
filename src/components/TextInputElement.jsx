const TextInputElement = ({ children, type, id, placeholder }) => {
	return (
		<>
			<label htmlFor={id}>{children}</label>
			<br />
			<input type={type} id={id} placeholder={placeholder} required />
			<br />
		</>
	);
};

export default TextInputElement;
