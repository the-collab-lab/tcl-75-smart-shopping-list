import { useCallback } from 'react';
import { useStateWithStorage, normalizeAndVerifyItem } from '../utils';
import { addItem } from '../api';
import { RadioInputElement, TextInputElement } from '../components';
import { DocumentData } from 'firebase/firestore';

const daysUntilPurchaseOptions = {
	Soon: 7,
	'Kind of soon': 14,
	'Not soon': 30,
};

const addNormalizedItem = async (
	itemName: string,
	daysUntilNextPurchase: string,
	listPath: string,
) => {
	try {
		const isItemAdded = await addItem(listPath, {
			itemName,
			daysUntilNextPurchase,
		});

		if (isItemAdded) {
			alert(
				`${itemName} was added to the list! The next purchase date is set to ${daysUntilNextPurchase} days from now.`,
			);
		}
	} catch (error) {
		alert(
			`Item was not added to the database, Error: ${error instanceof Error ? error.message : error}`,
		);
	}
};

export function AddItems({ items }: { items: DocumentData[] }) {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', '/');

	const handleSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const form = event.target as HTMLFormElement;
			const itemName = (
				form.elements.namedItem('item-name') as HTMLInputElement
			).value;
			const daysUntilNextPurchase = (
				form.elements.namedItem('purchase-date') as HTMLInputElement
			).value;

			try {
				const normalizedItemName = normalizeAndVerifyItem(items, itemName);
				addNormalizedItem(normalizedItemName, daysUntilNextPurchase, listPath);
			} catch (error) {
				alert(error);
			} finally {
				form.reset();
			}
		},
		[listPath, items],
	);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<TextInputElement
					type="text"
					id="item-name"
					placeholder="Enter item name"
					label={'Item Name: '}
					required={true}
				/>

				{Object.entries(daysUntilPurchaseOptions).map(([key, value]) => (
					<RadioInputElement
						key={key}
						label={key}
						id={key}
						value={value}
						required={true}
					/>
				))}
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
