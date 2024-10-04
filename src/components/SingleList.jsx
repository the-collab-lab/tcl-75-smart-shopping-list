import './SingleList.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import { MaterialListButton, MaterialButton } from './material-buttons';
import { useAuth, deleteList } from '../api';
import { ConfirmDialog } from './ConfirmDialog';

export const deletionResponse = {
	hard: `List deleted permanently.`,
	soft: `List removed from user view.`,
};

export function SingleList({
	item,
	setListPath,
	setImportantList,
	isImportant,
}) {
	const [isHovered, setIsHovered] = useState(false);
	const [open, isOpen] = useState(false);

	const navigate = useNavigate();
	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	const { name, path } = item;
	const listPath = path.slice(0, path.indexOf('/'));

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
		const deletionType = listPath === userId ? 'hard' : 'soft';

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

	const pinStyle = {
		visibility: isImportant || isHovered ? 'visible' : 'hidden',
	};

	const deleteStyle = {
		visibility: isHovered ? 'visible' : 'hidden',
	};

	const props = {
		handleDelete,
		title: `Are you sure you want to delete ${name}?`,
		setOpen: isOpen,
		open: open,
	};

	return (
		<>
			{open && <ConfirmDialog props={props} />}
			<li
				className={`SingleList ${isHovered && 'hovered'}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<MaterialButton
					variant="text"
					sx={pinStyle}
					onClick={handleImportantList}
					startIcon={<PushPinIcon />}
				/>

				<MaterialListButton onClick={handleNavigate} buttonText={name} />
				<MaterialButton
					variant="text"
					onClick={toggleDialog}
					sx={deleteStyle}
					startIcon={<DeleteIcon />}
				/>
			</li>
		</>
	);
}
