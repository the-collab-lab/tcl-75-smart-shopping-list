import { useEffect, useState } from 'react';
import { calculateUrgency } from './calculateUrgency';

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
