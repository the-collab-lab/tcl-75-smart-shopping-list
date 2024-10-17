import { Tooltip, IconButton, Box } from '@mui/material';

export const tooltipStyle = {
	fontSize: '1.5rem',
	marginBlockStart: '0',
	marginBlockEnd: '0',
};

export function IconWithTooltip({
	icon,
	onClick,
	ariaLabel,
	title,
	placement,
}) {
	return (
		<Tooltip
			title={<Box style={tooltipStyle}>{title}</Box>}
			placement={placement}
			arrow
		>
			<IconButton onClick={onClick} aria-label={ariaLabel}>
				{icon}
			</IconButton>
		</Tooltip>
	);
}
