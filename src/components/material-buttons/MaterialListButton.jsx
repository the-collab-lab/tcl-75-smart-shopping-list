import { MaterialButton } from './MaterialButton';

export const whiteFontColor = {
	color: 'white',
};

export const buttonStyle = {
	width: '15em',
	fontSize: '1.5rem',
	...whiteFontColor,
};

export const MaterialListButton = ({ buttonText, onClick }) => {
	return (
		<MaterialButton
			sx={buttonStyle}
			type="button"
			onClick={onClick}
			buttonText={buttonText}
		/>
	);
};
