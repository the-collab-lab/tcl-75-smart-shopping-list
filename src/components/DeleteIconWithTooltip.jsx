import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';

export const tooltipStyle = {
	fontSize: '1.5rem',
	marginBlockStart: '0',
	marginBlockEnd: '0',
};

export const DeleteIconWithTooltip = ({ ariaLabel, toggleDialog }) => {
	return (
		<Tooltip title={<p style={tooltipStyle}>Delete</p>} placement="right" arrow>
			<IconButton onClick={toggleDialog} aria-label={ariaLabel}>
				<DeleteOutlineOutlined sx={{ color: 'white' }} fontSize="large" />
			</IconButton>
		</Tooltip>
	);
};
