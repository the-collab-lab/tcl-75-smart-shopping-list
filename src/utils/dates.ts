import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { DocumentData, Timestamp } from 'firebase/firestore';

export const ONE_DAY_IN_MILLISECONDS: number = 86400000;

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 */
export function addDaysFromToday(daysOffset: number): Date {
	return new Date(Date.now() + daysOffset * ONE_DAY_IN_MILLISECONDS);
}

/**
 * Calculates the estimated date for the next purchase based on current date, purchase history,
 * and total purchases.
 */
export const calculateDateNextPurchased = (
	currentDate: Date,
	item: DocumentData,
): Date => {
	try {
		// get purchase intervals and get new estimation for next purchase date
		const purchaseIntervals = calculatePurchaseIntervals(
			currentDate,
			item.dateCreated,
			item.dateNextPurchased,
			item.dateLastPurchased,
		);
		const estimatedNextPurchaseDate = getNextPurchaseEstimate(
			purchaseIntervals,
			item.totalPurchases + 1,
		);

		return estimatedNextPurchaseDate;
	} catch (error) {
		throw new Error(`Failed getting next purchase date: ${error}`);
	}
};

/**
 * Calculate the number of days between two dates.
 */
function getDaysBetweenDates(earlierDate: Date, laterDate: Date): number {
	return Math.floor(
		(laterDate.getTime() - earlierDate.getTime()) / ONE_DAY_IN_MILLISECONDS,
	);
}

/**
 * Calculate the purchase intervals between current, next, and last purchase dates.
 */
function calculatePurchaseIntervals(
	currentDate: Date,
	dateCreated: Timestamp,
	dateNextPurchased: Timestamp,
	dateLastPurchased: Timestamp | null,
): {
	lastEstimatedInterval: number;
	daysSinceLastPurchase: number;
} {
	const lastPurchaseDate = dateLastPurchased?.toDate();

	const lastEstimatedIntervalStartDate =
		lastPurchaseDate ?? dateCreated.toDate();

	const lastEstimatedInterval = getDaysBetweenDates(
		lastEstimatedIntervalStartDate,
		dateNextPurchased.toDate(),
	);

	const daysSinceLastPurchase =
		lastPurchaseDate === undefined
			? 0
			: getDaysBetweenDates(lastPurchaseDate, currentDate);

	return { lastEstimatedInterval, daysSinceLastPurchase };
}

/**
 * Calculate the next purchase estimate based on purchase intervals and total purchases.
 */
function getNextPurchaseEstimate(
	purchaseIntervals: {
		lastEstimatedInterval: number;
		daysSinceLastPurchase: number;
	},
	totalPurchases: number,
): Date {
	const { lastEstimatedInterval, daysSinceLastPurchase } = purchaseIntervals;

	try {
		const estimatedDaysUntilPurchase = calculateEstimate(
			lastEstimatedInterval,
			daysSinceLastPurchase,
			totalPurchases,
		);

		const nextPurchaseEstimate = addDaysFromToday(estimatedDaysUntilPurchase);

		return nextPurchaseEstimate;
	} catch (error) {
		throw new Error(`Failed updaing date next purchased: ${error}`);
	}
}
