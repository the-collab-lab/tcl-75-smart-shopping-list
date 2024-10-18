import { useEffect, useState } from 'react';
import { calculateUrgency } from '../utils';

export function useUrgency(items) {
	const [urgencyObject, setUrgencyObject] = useState({
		overdue: [],
		soon: [],
		kindOfSoon: [],
		notSoon: [],
		inactive: [],
	});

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

		setUrgencyObject(sortedUrgencyState);
	}, [items]);

	return { urgencyObject };
}
