import { useCallback } from 'react';
import { useStateWithStorage, normalizeItemName } from '../utils';
import { addItem } from '../api';
import TextInputElement from './TextInputElement';
import RadioInputElement from './RadioInputElement';

const daysUntilPurchaseOptions = {
	Soon: 7,
	'Kind of soon': 14,
	'Not soon': 30,
};

export function AddItems({ items }) {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const handleSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			const daysUntilNextPurchase =
				event.target.elements['purchase-date'].value;

			const itemName = event.target.elements['item-name'].value;

			try {
				if (itemName.trim() === '') {
					alert('Please add an item name.');
					return;
				}
				// normalize the name by removing all punctuation and spaces to check if the normalized item is already in the list
				const normalizedItemName = normalizeItemName(itemName);
				if (items) {
					// normalize the existing list items to compare them to the new input
					const currentItems = items.map((item) =>
						normalizeItemName(item.name),
					);
					if (currentItems.includes(normalizedItemName)) {
						alert('This item already exists in the list');
						return;
					}
				}
				await addItem(listPath, {
					itemName,
					daysUntilNextPurchase,
				});
				alert(
					`${itemName} was added to the list! The next purchase date is set to ${daysUntilNextPurchase} days from now.`,
				);
			} catch (error) {
				alert(`Item was not added to the database, Error: ${error.message}`);
			} finally {
				event.target.reset();
			}
		},
		[listPath],
	);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<TextInputElement
					type="text"
					id="item-name"
					placeholder="Enter item name"
					label="Item Name:"
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
