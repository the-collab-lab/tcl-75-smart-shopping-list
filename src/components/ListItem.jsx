import { useState } from 'react';
import './ListItem.css';
import { updateItem, deleteItem } from '../api';
import { calculateDateNextPurchased, ONE_DAY_IN_MILLISECONDS } from '../utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const currentDate = new Date();

const calculateIsPurchased = (dateLastPurchased) => {
	if (!dateLastPurchased) {
		return false;
	}
	const purchaseDate = dateLastPurchased.toDate();
	const oneDayLater = new Date(
		purchaseDate.getTime() + ONE_DAY_IN_MILLISECONDS,
	);

	return currentDate < oneDayLater;
};

export function ListItem({ item, listPath }) {
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
				toast.error(`Item was not marked as purchased`, error.message);
			}
		}
	};

	const handleDeleteItem = async () => {
		if (confirm(`Are you sure you want to delete this item?`)) {
			try {
				await deleteItem(listPath, id);
			} catch (error) {
				toast.error('Item was not deleted');
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
