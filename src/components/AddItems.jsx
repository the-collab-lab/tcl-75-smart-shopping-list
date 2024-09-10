import { useCallback } from 'react';
import { useStateWithStorage } from '../utils';
import { addItem } from '../api';
import TextInputElement from './TextInputElement';
import RadioInputElement from './RadioInputElement';

const daysUntilPurchaseOptions = {
	Soon: 7,
	'Kind of soon': 14,
	'Not soon': 30,
};

export function AddItems() {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const handleSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			const itemName = event.target.elements['item-name'].value;
			const daysUntilNextPurchase =
				event.target.elements['purchase-date'].value;

			try {
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
				>
					Item Name:
				</TextInputElement>

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
