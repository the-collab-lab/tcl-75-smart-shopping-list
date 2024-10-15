import { useState } from 'react';
import { PushPin, PushPinOutlined } from '@mui/icons-material';
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

	const importantStatusLabel = isImportant ? 'Unpin list' : 'Pin list';

	return (
		<>
			<li
				className={`SingleList ${isHovered && 'hovered'}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Tooltip
					title={<p style={tooltipStyle}>{importantStatusLabel}</p>}
					placement="left"
					arrow
				>
					<IconButton
						onClick={handleImportantList}
						sx={{ color: 'white' }}
						aria-label={importantStatusLabel}
					>
						{isImportant ? (
							<PushPin fontSize="large" />
						) : (
							<PushPinOutlined fontSize="large" />
						)}
					</IconButton>
				</Tooltip>

				<button onClick={handleClick}>{name}</button>
			</li>
		</>
	);
}
