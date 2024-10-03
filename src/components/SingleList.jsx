import { useNavigate } from 'react-router-dom';
import './SingleList.css';

export function SingleList({ name, path, setListPath }) {
	const navigate = useNavigate();

	function handleClick() {
		setListPath(path);
		setTimeout(() => {
			navigate('/list');
		}, 200);
	}

	return (
		<li className="SingleList">
			<button onClick={handleClick}>{name}</button>
		</li>
	);
}
