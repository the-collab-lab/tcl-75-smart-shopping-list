import { useNavigate } from 'react-router-dom';
import './SingleList.css';
import { useState } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';

export function SingleList({
	name,
	path,
	setListPath,
	setImportantList,
	isImportant,
}) {
	const [isHovered, setIsHovered] = useState(false);

	const navigate = useNavigate();

	const handleClick = () => {
		setListPath(path);
		setTimeout(() => {
			navigate('/list');
		}, 200);
	};

	const handleImportantList = () => {
		setImportantList(path);
	};

	const pinStyle = isImportant ? 'visible' : !isHovered ? 'hidden' : 'visible';

	return (
		<>
			<li
				className={`SingleList ${isHovered && 'hovered'}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<PushPinIcon
					fontSize="large"
					className={pinStyle}
					onClick={handleImportantList}
				/>

				<button onClick={handleClick}>{name}</button>
			</li>
		</>
	);
}
