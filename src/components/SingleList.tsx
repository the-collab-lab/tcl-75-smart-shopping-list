import { Dispatch } from 'react';
import './SingleList.css';

type Props = {
	name: string;
	path: string;
	setListPath: Dispatch<string>;
};

export function SingleList({ name, path, setListPath }: Props) {
	function handleClick() {
		setListPath(path);
	}

	return (
		<li className="SingleList">
			<button onClick={handleClick}>{name}</button>
		</li>
	);
}
