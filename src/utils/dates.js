import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

export const ONE_DAY_IN_MILLISECONDS = 86400000;

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 * @example
 * // Returns a Date 3 days in the future
 * addDaysFromToday(3)
 * @param {number} daysOffset
 */
export function addDaysFromToday(daysOffset) {
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
export const calculateDateNextPurchased = (currentDate, item) => {
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

function getDaysBetweenDates(earlierDate, laterDate) {
	/**
	 * Calculate the number of days between two dates.
	 * @param {Date} earlierDate The starting date.
	 * @param {Date} laterDate The ending date.
	 * @returns {number} The number of days between the two dates.
	 */
	return Math.floor(
		(laterDate.getTime() - earlierDate.getTime()) / ONE_DAY_IN_MILLISECONDS,
	);
}

function calculatePurchaseIntervals(
	/**
	 * Calculate the purchase intervals between current, next, and last purchase dates.
	 * @param {Date} currentDate The current date.
	 * @param {Date} dateNextPurchased The previously estimated next purchase date.
	 * @param {Date|null} dateLastPurchased The date the item was last purchased (can be null).
	 * @returns {Object} An object containing the last estimated interval and days since last purchase.
	 */
	currentDate,
	dateCreated,
	dateNextPurchased,
	dateLastPurchased,
) {
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

function getNextPurchaseEstimate(purchaseIntervals, totalPurchases) {
	console.log(`Total purchases: ${totalPurchases}`);
	const { lastEstimatedInterval, daysSinceLastPurchase } = purchaseIntervals;

	try {
		// calculate the next purchase estimate
		const estimatedDaysUntilPurchase = calculateEstimate(
			lastEstimatedInterval, // valid to be undefined
			daysSinceLastPurchase, // has to be a number
			totalPurchases,
		);

		const nextPurchaseEstimate = addDaysFromToday(estimatedDaysUntilPurchase);

		return nextPurchaseEstimate;
	} catch (error) {
		throw new Error(`Failed updaing date next purchased: ${error}`);
	}
}
