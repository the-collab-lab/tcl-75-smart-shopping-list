import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
	PushPin,
	PushPinOutlined,
	DeleteOutlineOutlined,
} from '@mui/icons-material';
import { Tooltip, IconButton, Button } from '@mui/material';
import { deleteList } from '../api';
import { useAuth } from '../hooks';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { tooltipStyle, IconWithTooltip } from './IconWithTooltip';
import './SingleList.css';

const deletionResponse = {
	hard: `List deleted permanently.`,
	soft: `List removed from user view.`,
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
	const { open, isOpen, toggleDialog } = useConfirmDialog();

	const [isHovered, setIsHovered] = useState(false);

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

	const handleDelete = async () => {
		const deletionType = listPathUserId === userId ? 'hard' : 'soft';

		try {
			await deleteList(deletionType, path, userId, userEmail);
			toast.success(deletionResponse[deletionType]);
		} catch (error) {
			toast.error(
				`List was not deleted. Error: ${error.message ? error.message : error}`,
			);
		}

		return;
	};

	const props = {
		handleDelete,
		title: `Are you sure you want to delete ${name}?`,
		setOpen: isOpen,
		open,
	};

	const importantStatusLabel = isImportant ? 'Unpin list' : 'Pin list';

	return (
		<>
			{open && <ConfirmDialog props={props} />}
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

				<Button sx={buttonStyle} onClick={handleNavigate}>
					{name}
				</Button>

				<IconWithTooltip
					icon={
						<DeleteOutlineOutlined sx={{ color: 'white' }} fontSize="large" />
					}
					ariaLabel="Delete list"
					onClick={toggleDialog}
					title="Delete"
					placement="right"
				/>
			</li>
		</>
	);
}
