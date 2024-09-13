import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

export const ONE_DAY_IN_MILLISECONDS = 86400000;

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 * @example
 * // Returns a Date 3 days in the future
 * getFutureDate(3)
 * @param {number} offset
 */
export function getFutureDate(offset) {
	return new Date(Date.now() + offset * ONE_DAY_IN_MILLISECONDS);
}

export const handleNextPurchaseDate = (
	name,
	currentDate,
	purchasesCount,
	dateNextPurchased,
	dateLastPurchased,
) => {
	console.log('-------------------------------------------');
	console.log(`[${name}]`);

	try {
		// get purchase intervals and get new estimation for next purchase date
		const purchaseIntervals = calculatePurchaseIntervals(
			currentDate,
			dateNextPurchased,
			dateLastPurchased,
		);
		const estimatedNextPurchaseDate = getNextPurchaseEstimate(
			purchaseIntervals,
			purchasesCount,
		);

		console.log(
			`New next purchase date: ${estimatedNextPurchaseDate.toLocaleString()}`,
		);
		console.log('-------------------------------------------');

		return estimatedNextPurchaseDate;
	} catch (error) {
		throw new Error(`Failed getting next purchase date: ${error}`);
	}
};

function getDaysBetweenDates(earlierDate, laterDate) {
	return Math.floor(
		(laterDate.getTime() - earlierDate.getTime()) / ONE_DAY_IN_MILLISECONDS,
	);
	console.log(
		`Calculated ${daysBetweenDates} day(s) between 
		${earlierDate.toLocaleString()} and ${laterDate.toLocaleString()}`,
	);
	return daysBetweenDates;
}
