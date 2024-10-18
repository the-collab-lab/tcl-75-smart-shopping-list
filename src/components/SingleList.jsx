import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteList } from '../api';
import { useAuth, useConfirmDialog } from '../hooks';
// import { PushPin, PushPinOutlined } from '@mui/icons-material';
// import { Tooltip, IconButton, Button } from '@mui/material';
import { ConfirmDialog } from './index';
// import { tooltipStyle, DeleteIconWithTooltip, ConfirmDialog } from './index';
// import { buttonStyle } from '../App';
import './SingleList.css';

const deletionResponse = {
	hard: `List deleted permanently.`,
	soft: `List removed from user view.`,
};

export function SingleList({
	item,
	setListPath,
	// setImportantList,
	// isImportant,
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

	// const handleImportantList = () => {
	// 	setImportantList(path);
	// };

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
		open: open,
	};

	// const importantStatusLabel = isImportant ? 'Unpin list' : 'Pin list';

	return (
		<>
			{open && <ConfirmDialog props={props} />}
			<li
				className={`SingleList ${isHovered && 'hovered'}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* <Tooltip
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
				</Tooltip> */}

				<button onClick={handleNavigate}>{name}</button>

				{/* <DeleteIconWithTooltip
					ariaLabel="Delete list"
					toggleDialog={toggleDialog}
				/> */}
				<button onClick={toggleDialog}>Delete list</button>
			</li>
		</>
	);
}
