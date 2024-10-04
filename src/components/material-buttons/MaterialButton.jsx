import Button from '@mui/material/Button';

export const whiteColor = {
	color: 'white',
};

const defaultSx = {
	fontSize: '1.3rem',
	...whiteColor,
};

export const MaterialButton = ({
	type = 'submit',
	color,
	onClick,
	buttonText,
	sx = defaultSx,
	startIcon,
	variant = 'outlined',
}) => {
	return (
		<Button
			color={color}
			fontSize="large"
			variant={variant}
			type={type}
			onClick={onClick}
			startIcon={startIcon}
			sx={sx}
		>
			{buttonText}
		</Button>
	);
};
