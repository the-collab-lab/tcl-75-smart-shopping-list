import { MaterialButton } from './MaterialButton';

export const MaterialListButton = ({ buttonText, onClick }) => {
	const buttonStyle = {
		width: '15em',
		fontSize: '1.5rem',
		color: 'white',
	};

	return (
		<MaterialButton
			style={buttonStyle}
			type="button"
			onClick={onClick}
			buttonText={buttonText}
		/>
	);
};
