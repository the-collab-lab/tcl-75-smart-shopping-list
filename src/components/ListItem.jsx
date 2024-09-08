import { useEffect, useState } from 'react';
import './ListItem.css';
import { updateItem } from '../api';
import { useStateWithStorage } from '../utils';
import { increment } from 'firebase/firestore';

export function ListItem({ name, itemId, purchaseTimestamp }) {
	const [isPurchased, setIsPurchased] = useState(false);
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	useEffect(() => {
		if (!purchaseTimestamp) {
			setIsPurchased(false);
			return;
		}
		const purchaseDate = purchaseTimestamp.toDate();
		const oneDayLater = new Date(purchaseDate.getTime() + 24 * 60 * 60 * 1000);
		const currentDate = new Date();
		if (purchaseTimestamp) {
			if (currentDate < oneDayLater) {
				setIsPurchased(true);
			} else {
				setIsPurchased(false);
			}
		} else {
			return;
		}
	}, []);

	const handleChange = async () => {
		setIsPurchased(!isPurchased);
		if (!isPurchased) {
			try {
				await updateItem(listPath, itemId, {
					dateLastPurchased: new Date(),
					totalPurchases: increment(1),
				});
			} catch (error) {
				alert(`Item was not marked as purchased`, error);
			}
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
