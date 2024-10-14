import { useState } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { Tooltip, IconButton } from '@mui/material';
import './SingleList.css';

export function SingleList({
	name,
	path,
	setListPath,
	setImportantList,
	isImportant,
}) {
	const [isHovered, setIsHovered] = useState(false);

	const handleClick = () => {
		setListPath(path);
	};

	const handleImportantList = () => {
		setImportantList(path);
	};

	const tooltipStyle = {
		fontSize: '1.5rem',
		marginBlockStart: '0',
		marginBlockEnd: '0',
	};

	const tooltipTitle = isImportant ? 'Pinned' : 'Not pinned';

	const iconButtonAreaLabel = isImportant ? 'Pin list' : 'Unpin list';

	return (
		<>
			<li
				className={`SingleList ${isHovered && 'hovered'}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Tooltip
					title={<p style={tooltipStyle}>{tooltipTitle}</p>}
					placement="left"
					arrow
				>
					<IconButton
						onClick={handleImportantList}
						sx={{ color: 'white' }}
						aria-label={iconButtonAreaLabel}
					>
						{isImportant ? (
							<PushPinIcon fontSize="large" />
						) : (
							<PushPinOutlinedIcon fontSize="large" />
						)}
					</IconButton>
				</Tooltip>

				<button onClick={handleClick}>{name}</button>
			</li>
		</>
	);
}
