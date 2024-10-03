import './SingleList.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import { MaterialListButton, MaterialButton } from './material-buttons';
import { useAuth, deleteList } from '../api';

const deletionResponse = {
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

	const navigate = useNavigate();
	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;
	console.log(`Item: ${Object.entries(item).map((d) => d)}`);

	const { name, path } = item;
	const listPath = path.slice(0, path.indexOf('/'));

	const handleClick = () => {
		setListPath(path);
		setTimeout(() => {
			navigate('/list');
		}, 200);
	};

	const handleImportantList = () => {
		setImportantList(path);
	};

	const handleDelete = async () => {
		const deletionType = listPath === userId ? 'hard' : 'soft';

		if (confirm(`Are you sure you want to delete ${name}?`)) {
			try {
				await deleteList(deletionType, path, userId, userEmail);
				alert(deletionResponse[deletionType]);
			} catch (error) {
				alert(
					`List was not deleted. Error: ${error.message ? error.message : error}`,
				);
			}
		}
		return;
	};

	const pinStyle = {
		visibility: isImportant || isHovered ? 'visible' : 'hidden',
	};

	const deleteStyle = {
		visibility: isHovered ? 'visible' : 'hidden',
	};

	return (
		<li
			className={`SingleList ${isHovered && 'hovered'}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<MaterialButton
				variant="text"
				style={pinStyle}
				onClick={handleImportantList}
				startIcon={<PushPinIcon />}
			/>

			<MaterialListButton onClick={handleClick} buttonText={name} />
			<MaterialButton
				variant="text"
				onClick={handleDelete}
				style={deleteStyle}
				startIcon={<DeleteIcon />}
			/>
		</li>
	);
}
