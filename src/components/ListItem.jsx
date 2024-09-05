import { useState } from 'react';
import './ListItem.css';

export function ListItem({ name, itemId, listPath }) {
	console.log('check item name', name);
	console.log('check itemId', itemId);
	console.log('check listPath', listPath);

	let [isPurchased, setIsPurchased] = useState(false);

	const handleChange = async () => {
		setIsPurchased(!isPurchased);
		if (!isPurchased) {
			await updateItem(listPath, itemId);
		}
	};
	return (
		<li className="ListItem">
			<input
				type="checkbox"
				id={`checkbox-${itemId}`}
				checked={isPurchased}
				onChange={handleChange}
			/>
			<label htmlFor={`checkbox-${itemId}`}>{name}</label>
		</li>
	);
}
