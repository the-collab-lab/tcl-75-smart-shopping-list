import { useCallback, useState } from 'react';
import { useStateWithStorage } from '../utils';
import { addItem } from '../api';
import InputElement from './InputElement';
import RadioInputElement from './RadioInputElement';

const soonDate = 7;
const kindOfSoonDate = 14;
const notSoonDate = 30;

export function AddItems() {
	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(null);
	const [itemName, setItemName] = useState('');

	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const handleTextChange = (event) => setItemName(event.target.value);

	const handleChange = (event) => {
		const numberOfDays = parseInt(event.target.value);
		setDaysUntilNextPurchase(numberOfDays);
	};

	const handleSubmit = useCallback(
		async (event) => {
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
			}
		},
		[itemName, daysUntilNextPurchase, listPath],
	);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<InputElement
					type="text"
					id="item-name"
					onChange={handleTextChange}
					value={itemName}
				>
					Item Name:
				</InputElement>

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
				{/* <label htmlFor="item-name">
					Item Name:
					<br />
					<input
						type="text"
						id="item-name"
						onChange={handleTextChange}
						value={itemName}
					/>
				</label> */}

				{/* <br /> */}
				{/* <label>
					<input
						type="radio"
						value={soonDate}
						checked={daysUntilNextPurchase === soonDate}
						onChange={handleChange}
					/>
					Soon
				</label>
				<br /> */}
				{/* <label>
					<input
						type="radio"
						value={kindOfSoonDate}
						checked={daysUntilNextPurchase === kindOfSoonDate}
						onChange={handleChange}
					/>
					Kind of soon
				</label>
				<br /> */}
				{/* <label>
					<input
						type="radio"
						value={notSoonDate}
						checked={daysUntilNextPurchase === notSoonDate}
						onChange={handleChange}
					/>
					Not soon
				</label>
				<br />
				<button type="submit">Submit</button> */}
			</form>
		</div>
	);
}
