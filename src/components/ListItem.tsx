import './ListItem.css';
import { useState } from 'react';
import { updateItem, deleteItem } from '../api';
import { calculateDateNextPurchased, ONE_DAY_IN_MILLISECONDS } from '../utils';
import { DocumentData, Timestamp } from 'firebase/firestore';

const currentDate = new Date();

const calculateIsPurchased = (dateLastPurchased: Timestamp) => {
	if (!dateLastPurchased) {
		return false;
	}
	const purchaseDate = dateLastPurchased.toDate();
	const oneDayLater = new Date(
		purchaseDate.getTime() + ONE_DAY_IN_MILLISECONDS,
	);

	return currentDate < oneDayLater;
};

export function ListItem({
	item,
	listPath,
}: {
	item: DocumentData;
	listPath: string;
}) {
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
				alert(
					`Item was not marked as purchased. Error: ${error instanceof Error ? error.message : error}`,
				);
			}
		}
	};

	const handleDeleteItem = async () => {
		if (confirm(`Are you sure you want to delete this item?`)) {
			try {
				await deleteItem(listPath, id);
			} catch (error) {
				alert(
					`Item was not deleted. Error: ${error instanceof Error ? error.message : error}`,
				);
			}
		}
		return;
	};

	return (
		<li className="ListItem">
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
