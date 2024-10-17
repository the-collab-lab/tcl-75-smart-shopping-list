import { TextField, Typography } from '@mui/material';
import { typographyStyle } from './ConfirmDialog';

const textFieldStyle = {
	'& .MuiInputBase-input': {
		fontSize: '1.7rem',
		color: 'white',
		borderColor: 'white',
	},
	'& .MuiInputBase-input::placeholder': {
		color: 'white',
		fontSize: '1.5rem',
		letterSpacing: '0.1rem',
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: 'primary.main', // Set the border color to primary.main
		},
		'&:hover fieldset': {
			borderColor: 'primary.main', // Set border color on hover
		},
		'&.Mui-focused fieldset': {
			borderColor: 'primary.main', // Set border color when focused
		},
	},
};

export function TextInputElement({
	label,
	type,
	id,
	placeholder,
	onChange,
	required,
}) {
	return (
		<>
			<Typography
				variant="body1"
				component="label"
				htmlFor={id}
				sx={typographyStyle}
				fontSize="large"
			>
				{label}
			</Typography>
			<br />
			<TextField
				type={type}
				id={id}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
				variant="outlined"
				focused
				fullWidth
				sx={textFieldStyle}
				pattern="^[^\s].+[^\s]$"
			/>
			<br />
		</>
	);
}
