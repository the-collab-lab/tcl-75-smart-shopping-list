import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { DocumentData, Timestamp } from 'firebase/firestore';

export const ONE_DAY_IN_MILLISECONDS: number = 86400000;

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 * @example
 * // Returns a Date 3 days in the future
 * addDaysFromToday(3)
 * @param {number} daysOffset
 */
export function addDaysFromToday(daysOffset: number): Date {
	return new Date(Date.now() + daysOffset * ONE_DAY_IN_MILLISECONDS);
}

/**
 * Calculates the estimated date for the next purchase based on current date, purchase history,
 * and total purchases.
 * @param {Date} currentDate - The current date to calculate against.
 * @param {Object} item - The item object containing purchase data.
 * @param {Date} item.dateCreated - The date the item was created.
 * @param {Date} item.dateNextPurchased - The previously estimated next purchase date.
 * @param {Date|null} item.dateLastPurchased - The last date the item was actually purchased, or null if not purchased yet.
 * @param {number} item.totalPurchases - The total number of purchases made for the item.
 * @returns {Date} - The estimated date of the next purchase.
 * @throws {Error} - Throws an error if the next purchase date cannot be calculated.
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
 * @param {Date} earlierDate The starting date.
 * @param {Date} laterDate The ending date.
 * @returns {number} The number of days between the two dates.
 */
function getDaysBetweenDates(earlierDate: Date, laterDate: Date): number {
	return Math.floor(
		(laterDate.getTime() - earlierDate.getTime()) / ONE_DAY_IN_MILLISECONDS,
	);
}

type PurchaseIntervals = {
	lastEstimatedInterval: number;
	daysSinceLastPurchase: number;
};

/**
 * Calculate the purchase intervals between current, next, and last purchase dates.
 * @param {Date} currentDate The current date.
 * @param {Date} dateNextPurchased The previously estimated next purchase date.
 * @param {Date|null} dateLastPurchased The date the item was last purchased (can be null).
 * @returns {Object} An object containing the last estimated interval and days since last purchase.
 */
function calculatePurchaseIntervals(
	currentDate: Date,
	dateCreated: Timestamp,
	dateNextPurchased: Timestamp,
	dateLastPurchased: Timestamp | null,
): PurchaseIntervals {
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
 * @param {Object} purchaseIntervals The intervals between the previous and current purchases.
 * @param {number} purchaseIntervals.lastEstimatedInterval The previously estimated number of days between purchases.
 * @param {number} purchaseIntervals.daysSinceLastPurchase The number of days since the last purchase.
 * @param {number} totalPurchases The total number of purchases made.
 * @returns {Date} The estimated next purchase date.
 * @throws {Error} If an error occurs during the next purchase estimation process.
 */
function getNextPurchaseEstimate(
	purchaseIntervals: PurchaseIntervals,
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
