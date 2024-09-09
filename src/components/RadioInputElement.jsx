const RadioInputElement = ({ children, id, value }) => {
	return (
		<>
			<input type="radio" name="purchase-date" id={id} value={value} required />
			<label htmlFor={id}>{children}</label>
			<br />
		</>
	);
};

export default RadioInputElement;
