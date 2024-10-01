import {
	getDateLastPurchasedOrDateCreated,
	getDaysFromDate,
	getDaysBetweenDates,
} from './dates';

const sortByUrgency = (item, daysUntilNextPurchase) => {
	if (daysUntilNextPurchase < 0) {
		return 'overdue';
	} else if (daysUntilNextPurchase >= 0 && daysUntilNextPurchase < 7) {
		return 'soon';
	} else if (daysUntilNextPurchase >= 7 && daysUntilNextPurchase < 30) {
		return 'kindOfSoon';
	} else if (daysUntilNextPurchase >= 30) {
		return 'notSoon';
	} else {
		throw new Error(`Failed to place [${item.name}]`);
	}
};

export const calculateUrgency = (item) => {
	// get date the item was purchased or created
	const itemDate = getDateLastPurchasedOrDateCreated(
		item.dateLastPurchased,
		item.dateCreated,
	);
	// check how many days have passed since that date
	const daysToToday = getDaysFromDate(itemDate);

	// if more than 60 days have passed
	if (daysToToday >= 60) {
		// sort as inactive
		return 'inactive';
	} else {
		// sort by the amount of days until next purchase date
		const daysUntilNextPurchase = getDaysBetweenDates(
			new Date(),
			item.dateNextPurchased.toDate(),
		);
		return sortByUrgency(item, daysUntilNextPurchase);
	}
};
