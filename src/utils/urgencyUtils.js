import {
	getDateLastPurchasedOrDateCreated,
	getDaysFromDate,
	getDaysBetweenDates,
} from '../utils';

export const sortByUrgency = (item, daysUntilNextPurchase) => {
	if (daysUntilNextPurchase < 0) {
		return 'overdue';
	} else if (daysUntilNextPurchase < 7) {
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
	const itemDate = getDateLastPurchasedOrDateCreated(
		item.dateLastPurchased,
		item.dateCreated,
	);

	const daysToToday = getDaysFromDate(itemDate);

	if (daysToToday >= 60) {
		return 'inactive';
	} else {
		const daysUntilNextPurchase = getDaysBetweenDates(
			new Date(),
			item.dateNextPurchased.toDate(),
		);
		return sortByUrgency(item, daysUntilNextPurchase);
	}
};

export const getUrgency = (name, urgencyObject) => {
	const statusArray = Object.entries(urgencyObject).find(([, items]) => {
		return items.some((item) => item.name === name);
	});
	if (!statusArray) {
		throw new Error(`Failed to get class name of ${name}`);
	}
	return statusArray[0];
};
