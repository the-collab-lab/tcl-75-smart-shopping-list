import { useEffect, useState } from 'react';
import './ListItem.css';
import { updateItem } from '../api';

export function ListItem({ name, itemId, listPath, purchaseDate }) {
	/**TO DO: mark items as !isPurchased after 24 hours. Currently, I'm thinking
	 * to subtract the purchaseDate from the current time at page load. Then check
	 * if the difference is 24 hours. If less, item will still show as purchased. If
	 * more than 24 hours difference, checkbox will be unchecked
	 */
	// let currentDate = new Date();
	// console.log('check currentDate', currentDate);

	// useEffect to check if item is purchased on page load so that the checkboxes are checked
	useEffect(() => {
		if (purchaseDate) {
			setIsPurchased(true);
		}
	}, []);

	// local state to keep track of purchased status
	let [isPurchased, setIsPurchased] = useState(false);

	// toggle purchase status and send the listPath and itemId to the updateItem function
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
