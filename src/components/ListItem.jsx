import { useState } from 'react';
import './ListItem.css';
import { updateItem, deleteItem } from '../api';
import { calculateDateNextPurchased, ONE_DAY_IN_MILLISECONDS } from '../utils';
import RestoreIcon from '@mui/icons-material/Restore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const currentDate = new Date();

const urgencyStatusIcons = {
	overdue: RestoreIcon,
	soon: RestartAltIcon,
	kindOfSoon: RadioButtonUncheckedIcon,
	notSoon: RadioButtonCheckedIcon,
	inactive: RemoveCircleIcon,
};

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

export function ListItem({ item, listPath, itemUrgencyStatus }) {
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

	const UrgencyStatusIcon = urgencyStatusIcons[itemUrgencyStatus];

	return (
		<li className={`ListItem`}>
			{UrgencyStatusIcon && <UrgencyStatusIcon fontSize="large" />}
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
