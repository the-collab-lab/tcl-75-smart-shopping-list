import { useEffect, useState } from 'react';
import './ListItem.css';
import { updateItem } from '../api';
import { handleNextPurchaseDate, ONE_DAY_IN_MILLISECONDS } from '../utils';
import { increment } from 'firebase/firestore';

// move current date outside of component to use it thoroughout the component
const currentDate = new Date();

export function ListItem({ item, listPath }) {
	const [isPurchased, setIsPurchased] = useState(false);
	// ---------------------------------------------------------------
	// the path from the hook is glitching in case the user has multiple empty lists:
	// navigates to the first empty list instead of the path that was clicked on
	// const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);
	// ---------------------------------------------------------------
	const { name, id, dateLastPurchased, dateNextPurchased, totalPurchases } =
		item;

	useEffect(() => {
		if (!dateLastPurchased) {
			setIsPurchased(false);
			return;
		}
		const purchaseDate = dateLastPurchased.toDate();
		const oneDayLater = new Date(
			purchaseDate.getTime() + ONE_DAY_IN_MILLISECONDS,
		);
		if (dateLastPurchased) {
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
				id={`checkbox-${id}`}
				checked={isPurchased}
				onChange={handleChange}
			/>
			<label htmlFor={`checkbox-${id}`}>{name}</label>
		</li>
	);
}
