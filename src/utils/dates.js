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
		const { estimatedDaysUntilPurchase, nextPurchaseEstimate } =
			getNextPurchaseEstimate(purchaseIntervals, item.totalPurchases + 1);

		const averagePurchaseInterval = getAveragePurchaseInterval(
			purchaseIntervals,
			estimatedDaysUntilPurchase,
		).toFixed(1);

		return { nextPurchaseEstimate, averagePurchaseInterval };
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
export function getDaysBetweenDates(earlierDate, laterDate) {
	return Math.floor(
		(laterDate.getTime() - earlierDate.getTime()) / ONE_DAY_IN_MILLISECONDS,
	);
}

// takes in a Date
// calculates days since date that was passed and today
export const getDaysFromDate = (pastDate) =>
	getDaysBetweenDates(pastDate, new Date());

// takes in Timestamps, returns a Date
export const getDateLastPurchasedOrDateCreated = (
	dateLastPurchased,
	dateCreated,
) => dateLastPurchased?.toDate() ?? dateCreated.toDate();

/**
 * Calculate the purchase intervals between current, next, and last purchase dates.
 * @param {Date} currentDate The current date.
 * @param {Date} dateNextPurchased The previously estimated next purchase date.
 * @param {Date|null} dateLastPurchased The date the item was last purchased (can be null).
 * @returns {Object} An object containing the last estimated interval and days since last purchase.
 */
function calculatePurchaseIntervals(
	currentDate,
	dateCreated,
	dateNextPurchased,
	dateLastPurchased,
) {
	const lastEstimatedIntervalStartDate = getDateLastPurchasedOrDateCreated(
		dateLastPurchased,
		dateCreated,
	);

	const lastEstimatedInterval = getDaysBetweenDates(
		lastEstimatedIntervalStartDate,
		dateNextPurchased.toDate(),
	);

	const daysSinceLastPurchase =
		dateLastPurchased?.toDate() === undefined
			? 0
			: getDaysBetweenDates(dateLastPurchased.toDate(), currentDate);

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
function getNextPurchaseEstimate(purchaseIntervals, totalPurchases) {
	const { lastEstimatedInterval, daysSinceLastPurchase } = purchaseIntervals;

	try {
		const estimatedDaysUntilPurchase = calculateEstimate(
			lastEstimatedInterval,
			daysSinceLastPurchase,
			totalPurchases,
		);

		const nextPurchaseEstimate = addDaysFromToday(estimatedDaysUntilPurchase);

		return { estimatedDaysUntilPurchase, nextPurchaseEstimate };
	} catch (error) {
		throw new Error(`Failed updaing date next purchased: ${error}`);
	}
}

/**
 * Calculates the average purchase interval based on known purchase intervals.
 *
 * This function takes into account the last estimated purchase interval,
 * the number of days since the last purchase, and the estimated days until the next purchase.
 * It computes the average of these intervals by summing them up and dividing by the total count.
 *
 * @param {Object} purchaseIntervals - An object containing the purchase interval data.
 * @param {number} purchaseIntervals.lastEstimatedInterval - The last estimated interval in days.
 * @param {number} purchaseIntervals.daysSinceLastPurchase - The number of days since the last purchase.
 * @param {number} estimatedDaysUntilPurchase - The estimated number of days until the next purchase.
 * @returns {number} The average purchase interval calculated from the provided intervals.
 */
function getAveragePurchaseInterval(
	purchaseIntervals,
	estimatedDaysUntilPurchase,
) {
	const { lastEstimatedInterval, daysSinceLastPurchase } = purchaseIntervals;
	const knownIntervals = [
		lastEstimatedInterval,
		daysSinceLastPurchase,
		estimatedDaysUntilPurchase,
	];

	return (
		knownIntervals.reduce((sum, interval) => sum + interval, 0) /
		knownIntervals.length
	);
}
