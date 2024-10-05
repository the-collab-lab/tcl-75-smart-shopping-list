import { useEffect, useState } from 'react';
import { calculateUrgency } from '../utils';

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
