import { ONE_DAY_IN_MILLISECONDS, currentDate } from './dates';

export const calculateIsPurchased = (dateLastPurchased) => {
	if (!dateLastPurchased) {
		return false;
	}
	const purchaseDate = dateLastPurchased.toDate();
	const oneDayLater = new Date(
		purchaseDate.getTime() + ONE_DAY_IN_MILLISECONDS,
	);

	return currentDate < oneDayLater;
};
