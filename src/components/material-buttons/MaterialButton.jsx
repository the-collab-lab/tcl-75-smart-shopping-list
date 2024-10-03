import Button from '@mui/material/Button';

const defaultStyle = {
	fontSize: '1.3rem',
	color: 'white',
};

export const MaterialButton = ({
	type,
	onClick,
	buttonText,
	style = defaultStyle,
	startIcon,
	variant = 'outlined',
}) => {
	return (
		<Button
			fontSize="large"
			variant={variant}
			type={type}
			onClick={onClick}
			startIcon={startIcon}
			style={style}
		>
			{buttonText}
		</Button>
	);
};
