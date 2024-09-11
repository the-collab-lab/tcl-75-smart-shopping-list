import { useEffect, useState } from 'react';
import './ListItem.css';
import { updateItem, getNextPurchaseEstimate } from '../api';
import { useStateWithStorage } from '../utils';
import { increment } from 'firebase/firestore';

// move current date outside of component to use it thoroughout the component
const currentDate = new Date();

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

	const handleNextPurchaseDate = async (
		listPath,
		itemId,
		currentDate,
		purchaseTimestamp,
	) => {
		console.log('Attempting updating next purchase date...');
		const response = await getNextPurchaseEstimate(
			listPath,
			itemId,
			currentDate,
			purchaseTimestamp,
		);
		console.log(response);
	};

	const handleChange = async () => {
		setIsPurchased(!isPurchased);
		if (!isPurchased) {
			try {
				await updateItem(listPath, itemId, {
					dateLastPurchased: currentDate,
					totalPurchases: increment(1),
				});

				handleNextPurchaseDate(
					listPath,
					itemId,
					currentDate,
					purchaseTimestamp,
				);
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
