import { useEffect, useState } from 'react';
import './ListItem.css';
import { updateItem } from '../api';

export function ListItem({
	name,
	itemId,
	listPath,
	purchaseDate,
	nextPurchaseDate,
}) {
	let [isPurchased, setIsPurchased] = useState(false);

	useEffect(() => {
		const currentDate = new Date();
		const nextPurchase = nextPurchaseDate.toDate();
		if (purchaseDate) {
			if (currentDate < nextPurchase) {
				setIsPurchased(true);
			} else {
				setIsPurchased(false);
			}
		}
	}, []);

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
