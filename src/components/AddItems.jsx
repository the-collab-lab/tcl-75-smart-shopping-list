import { useCallback, useState } from 'react';
import { useStateWithStorage } from '../utils';
import { addItem } from '../api';
import TextInputElement from './TextInputElement';
import RadioInputElement from './RadioInputElement';

const soonDate = 7;
const kindOfSoonDate = 14;
const notSoonDate = 30;

export function AddItems() {
	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(null);
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const handleChange = (event) => {
		const numberOfDays = parseInt(event.target.value);
		setDaysUntilNextPurchase(numberOfDays);
	};

	const handleSubmit = useCallback(
		async (event) => {
			console.log(event.target.elements, 'form elements');
			const itemName = event.target.elements['item-name'].value;
			event.preventDefault();
			if (itemName === '') {
				alert('Please add an item name.');
				return;
			}
			if (!daysUntilNextPurchase) {
				alert('Please select an option for date');
				return;
			}

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
		[daysUntilNextPurchase, listPath],
	);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<TextInputElement type="text" id="item-name">
					Item Name:
				</TextInputElement>

				<RadioInputElement
					id="soon"
					value={soonDate}
					checked={daysUntilNextPurchase === soonDate}
					onChange={handleChange}
				>
					Soon
				</RadioInputElement>

				<RadioInputElement
					id="kindofsoon"
					value={kindOfSoonDate}
					checked={daysUntilNextPurchase === kindOfSoonDate}
					onChange={handleChange}
				>
					Kind of soon
				</RadioInputElement>

				<RadioInputElement
					id="notsoon"
					value={notSoonDate}
					checked={daysUntilNextPurchase === notSoonDate}
					onChange={handleChange}
				>
					Not soon
				</RadioInputElement>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
