import { useEffect, useState } from 'react';
import {
	getDateLastPurchasedOrDateCreated,
	getDaysFromDate,
	getDaysBetweenDates,
} from './dates';

/**
 * Set some state in React, and also persist that value in localStorage.
 * @param {string} storageKey The key of the value in localStorage.
 * @param {string | null} initialValue The initial value to store in localStorage and React state.
 * @returns {[string | null, React.Dispatch<string | null>]}
 */
export function useStateWithStorage(storageKey, initialValue) {
	const [value, setValue] = useState(
		() => localStorage.getItem(storageKey) ?? initialValue,
	);
	useEffect(() => {
		if (value === null || value === undefined) {
			return localStorage.removeItem(storageKey);
		}
		return localStorage.setItem(storageKey, value);
	}, [storageKey, value]);

	return [value, setValue];
}

export function useUrgency(items) {
	const [urgencyObject, setUrgecyObject] = useState({
		overdue: [],
		soon: [],
		kindOfSoon: [],
		notSoon: [],
		inactive: [],
	});

	const getUrgency = (name) => {
		const statusArray = Object.entries(urgencyObject).find(
			([status, items]) => {
				if (items.some((item) => item.name === name)) {
					return status;
				}
			},
		);
		if (!statusArray) {
			throw new Error(`Failed to get class name of ${name}`);
		}
		return statusArray[0];
	};

	const sortByUrgency = (item, daysUntilNextPurchase) => {
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

	const calculateUrgency = (item) => {
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

	useEffect(() => {
		if (items.length === 0) return;

		let initialUrgencyState = {
			overdue: new Set(),
			soon: new Set(),
			kindOfSoon: new Set(),
			notSoon: new Set(),
			inactive: new Set(),
		};

		items.forEach((item) => {
			const urgency = calculateUrgency(item);
			initialUrgencyState[urgency].add(item);
		});

		const sortedUrgencyState = Object.fromEntries(
			Object.entries(initialUrgencyState).map(([key, set]) => [
				key,
				Array.from(set).sort((a, b) => a.name.localeCompare(b.name)),
			]),
		);

		setUrgecyObject(sortedUrgencyState);
	}, [items]);

	return { getUrgency, urgencyObject };
}
