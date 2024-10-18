import { useEffect, useState } from 'react';
import { calculateUrgency } from '../utils';
import { DocumentData } from 'firebase/firestore';

export type UrgencyStatus =
	| 'overdue'
	| 'soon'
	| 'kind of soon'
	| 'not soon'
	| 'inactive';

type UrgencyObject = {
	[_key in UrgencyStatus]: Set<DocumentData>;
};

export function useUrgency(items: DocumentData[]) {
	const [urgencyObject, setUrgencyObject] = useState<UrgencyObject>({
		overdue: new Set(),
		soon: new Set(),
		'kind of soon': new Set(),
		'not soon': new Set(),
		inactive: new Set(),
	});

	useEffect(() => {
		if (items.length === 0) return;

		const initialUrgencyState: UrgencyObject = {
			overdue: new Set(),
			soon: new Set(),
			'kind of soon': new Set(),
			'not soon': new Set(),
			inactive: new Set(),
		};

		items.forEach((item) => {
			const urgency = calculateUrgency(item) as UrgencyStatus;
			initialUrgencyState[urgency].add(item);
		});

		const sortedUrgencyState: UrgencyObject = {
			overdue: new Set(
				Array.from(initialUrgencyState.overdue).sort((a, b) =>
					a.name.localeCompare(b.name),
				),
			),
			soon: new Set(
				Array.from(initialUrgencyState.soon).sort((a, b) =>
					a.name.localeCompare(b.name),
				),
			),
			'kind of soon': new Set(
				Array.from(initialUrgencyState['kind of soon']).sort((a, b) =>
					a.name.localeCompare(b.name),
				),
			),
			'not soon': new Set(
				Array.from(initialUrgencyState['not soon']).sort((a, b) =>
					a.name.localeCompare(b.name),
				),
			),
			inactive: new Set(
				Array.from(initialUrgencyState.inactive).sort((a, b) =>
					a.name.localeCompare(b.name),
				),
			),
		};

		setUrgencyObject(sortedUrgencyState);
	}, [items]);

	return { urgencyObject };
}
