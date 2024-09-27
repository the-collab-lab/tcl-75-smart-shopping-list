import './SingleList.css';
import { Dispatch } from 'react';

export function SingleList({
	name,
	path,
	setListPath,
}: {
	name: string;
	path: string;
	setListPath: Dispatch<string>;
}) {
	function handleClick() {
		setListPath(path);
	}

	return (
		<li className="SingleList">
			<button onClick={handleClick}>{name}</button>
		</li>
	);
}
