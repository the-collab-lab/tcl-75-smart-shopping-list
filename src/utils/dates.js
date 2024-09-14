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

export const handleNextPurchaseDate = (
	name,
	currentDate,
	dateCreated,
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
			dateCreated,
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
}

function calculatePurchaseIntervals(
	currentDate,
	dateCreated,
	dateNextPurchased,
	dateLastPurchased,
) {
	const lastPurchaseDate = dateLastPurchased?.toDate(); // valid to be null
	console.log(
		`Previously purchased on: ${lastPurchaseDate === undefined ? undefined : lastPurchaseDate.toLocaleString()}`,
	);
	console.log(
		`Previous next purchase date: ${dateNextPurchased.toDate().toLocaleString()}`,
	);

	// valid to be undefined
	const lastEstimatedInterval = getDaysBetweenDates(
		lastPurchaseDate === undefined ? dateCreated.toDate() : lastPurchaseDate,
		dateNextPurchased.toDate(),
	);

	console.log(`Last estimated interval: ${lastEstimatedInterval}`);

	// has to be a number
	const daysSinceLastPurchase =
		lastPurchaseDate === undefined
			? 0
			: getDaysBetweenDates(lastPurchaseDate, currentDate);

	console.log(`Days since last purchase: ${daysSinceLastPurchase}`);

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
