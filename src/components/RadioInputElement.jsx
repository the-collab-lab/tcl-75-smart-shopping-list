import { Radio, Tooltip, FormControlLabel } from '@mui/material';
import { tooltipStyle } from './MUIStyles';

const radioStyle = {
	color: 'white',
	m: 2,
	my: 3,
};

export const RadioInputElement = ({ label, id, value, required }) => {
	return (
		<FormControlLabel
			control={
				<Radio
					value={value}
					id={id}
					required={required}
					inputProps={{ 'aria-label': label }}
					color="success"
					sx={radioStyle}
				/>
			}
			label={
				<Tooltip
					title={<p style={tooltipStyle}>{`${value} days from today`}</p>}
					arrow
				>
					<span style={{ fontSize: '1.8rem' }}>{label}</span>
				</Tooltip>
			}
		/>
	);
};
