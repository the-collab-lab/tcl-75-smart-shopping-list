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

export function getDaysBetweenDates(earlierDate, laterDate) {
	const daysBetweenDates = Math.floor(
		(laterDate.getTime() - earlierDate.getTime()) / ONE_DAY_IN_MILLISECONDS,
	);
	console.log(
		`Calculated ${daysBetweenDates} day(s) between 
		${earlierDate.toLocaleString()} and ${laterDate.toLocaleString()}`,
	);
	return daysBetweenDates;
}
