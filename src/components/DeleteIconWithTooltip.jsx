import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';
import { tooltipStyle } from './MUIStyles';

export const DeleteIconWithTooltip = ({ ariaLabel, toggleDialog }) => {
	return (
		<Tooltip title={<p style={tooltipStyle}>Delete</p>} placement="right" arrow>
			<IconButton onClick={toggleDialog} aria-label={ariaLabel}>
				<DeleteOutlineOutlined sx={{ color: 'white' }} fontSize="large" />
			</IconButton>
		</Tooltip>
	);
};
