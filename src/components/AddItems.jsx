import { useCallback } from 'react';
import { normalizeItemName } from '../utils';
import { useStateWithStorage } from '../hooks';
import { addItem } from '../api';
import { RadioInputElement, TextInputElement } from './index.js';
import { toast } from 'react-toastify';

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
			console.log(daysUntilNextPurchase, 'days until next purchase');
			const itemName = event.target.elements['item-name'].value;

			try {
				if (itemName.trim() === '') {
					toast.error('Please add an item name.');
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
						toast.error('This item already exists in the list');
						return;
					}
				}
				await addItem(listPath, {
					itemName,
					daysUntilNextPurchase,
				});
				toast.success(
					`${itemName} was added to the list! The next purchase date is set to ${daysUntilNextPurchase} days from now.`,
				);
			} catch (error) {
				toast.error(
					`Item was not added to the database, Error: ${error.message}`,
				);
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

				{Object.entries(daysUntilPurchaseOptions).map(([status, days]) => (
					<RadioInputElement
						key={status}
						label={status}
						id={status}
						value={days}
						required={status}
					/>
				))}
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
