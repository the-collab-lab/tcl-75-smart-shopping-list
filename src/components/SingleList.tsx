import { useState, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteList } from '../api';
import { DocumentData } from 'firebase/firestore';
import { useAuth, useConfirmDialog } from '../hooks';
import { toast } from 'react-toastify';
import { PushPin, PushPinOutlined } from '@mui/icons-material';
import { Tooltip, IconButton, Button } from '@mui/material';
import { tooltipStyle, DeleteIconWithTooltip, ConfirmDialog } from './index';
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
}: {
	item: DocumentData;
	setListPath: Dispatch<string>;
	setImportantList: Dispatch<string>;
	isImportant: string;
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
				`List was not deleted. Error: ${error instanceof Error ? error.message : error}`,
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

				<DeleteIconWithTooltip
					ariaLabel="Delete list"
					toggleDialog={toggleDialog}
				/>
			</li>
		</>
	);
}
