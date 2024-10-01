import { useState } from 'react';
import './ListItem.css';
import { updateItem, deleteItem } from '../api';
import {
	calculateDateNextPurchased,
	currentDate,
	calculateIsPurchased,
} from '../utils';

export function ListItem({ item, listPath, className }) {
	const [isPurchased, setIsPurchased] = useState(() =>
		calculateIsPurchased(item.dateLastPurchased),
	);
	const { name, id } = item;

	const updateItemOnPurchase = () => {
		return {
			dateLastPurchased: currentDate,
			dateNextPurchased: calculateDateNextPurchased(currentDate, item),
			totalPurchases: item.totalPurchases + 1,
		};
	};

	const handleChange = async () => {
		setIsPurchased(!isPurchased);
		if (!isPurchased) {
			try {
				const updatedItem = updateItemOnPurchase();

				await updateItem(listPath, id, { ...updatedItem });
			} catch (error) {
				alert(`Item was not marked as purchased`, error.message);
			}
		}
	};

	const handleDeleteItem = async () => {
		if (confirm(`Are you sure you want to delete this item?`)) {
			try {
				await deleteItem(listPath, id);
			} catch (error) {
				alert('Item was not deleted');
			}
		}
		return;
	};

	return (
		<li className={`ListItem`}>
			<div className={`urgency-status ${className}`} />
			<input
				type="checkbox"
				id={`checkbox-${id}`}
				checked={isPurchased}
				onChange={handleChange}
			/>
			<label htmlFor={`checkbox-${id}`}>{name}</label>
			<button onClick={handleDeleteItem}>Delete Item</button>
		</li>
	);
}
