import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
	PushPin,
	PushPinOutlined,
	DeleteOutlineOutlined,
} from '@mui/icons-material';
import { Tooltip, IconButton, Button } from '@mui/material';
import { useAuth, deleteList } from '../api';
import { ConfirmDialog } from './ConfirmDialog';
import './SingleList.css';

const deletionResponse = {
	hard: `List deleted permanently.`,
	soft: `List removed from user view.`,
};

const tooltipStyle = {
	fontSize: '1.5rem',
	marginBlockStart: '0',
	marginBlockEnd: '0',
};

export const buttonStyle = {
	color: 'white',
	width: '15em',
	fontSize: '1.5rem',
};

export function SingleList({
	item,
	setListPath,
	setImportantList,
	isImportant,
}) {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [isHovered, setIsHovered] = useState(false);
	const [open, isOpen] = useState(false);

	const userId = user?.uid;
	const userEmail = user?.email;
	const { name, path } = item;

	const listPathUserId = path.slice(0, path.indexOf('/'));

	const handleNavigate = () => {
		setListPath(path);
		setTimeout(() => {
			navigate('/list');
		}, 200);
	};

	const handleImportantList = () => {
		setImportantList(path);
	};

	const toggleDialog = () => {
		isOpen((prev) => !prev);
	};

	const handleDelete = async () => {
		const deletionType = listPathUserId === userId ? 'hard' : 'soft';

		try {
			await deleteList(deletionType, path, userId, userEmail);
			alert(deletionResponse[deletionType]);
		} catch (error) {
			alert(
				`List was not deleted. Error: ${error.message ? error.message : error}`,
			);
		}

		return;
	};

	const props = {
		handleDelete,
		title: `Are you sure you want to delete ${name}?`,
		setOpen: isOpen,
		open: open,
	};

	const tooltipTitle = isImportant ? 'Pinned' : 'Not pinned';

	const iconButtonAreaLabel = isImportant ? 'Pin list' : 'Unpin list';

	return (
		<>
			{open && <ConfirmDialog props={props} />}
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
							<PushPin fontSize="large" />
						) : (
							<PushPinOutlined fontSize="large" />
						)}
					</IconButton>
				</Tooltip>

				<Button sx={buttonStyle} onClick={handleNavigate}>
					{name}
				</Button>

				<Tooltip
					title={<p style={tooltipStyle}>Delete</p>}
					placement="right"
					arrow
				>
					<IconButton onClick={toggleDialog} aria-label="Delete list">
						<DeleteOutlineOutlined sx={{ color: 'white' }} fontSize="large" />
					</IconButton>
				</Tooltip>
			</li>
		</>
	);
}
