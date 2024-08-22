import { useCallback, useState } from 'react';
import { useStateWithStorage } from '../utils';
import { addItem } from '../api';

const soonDate = 7;
const kindOfSoonDate = 14;
const notSoonDate = 30;

export function ManageList() {
	const [selectedOption, setSelectedOption] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [listPath, setListPath] = useStateWithStorage(
		'tcl-shopping-list-path',
		null,
	);

	const handleTextChange = (event) => {
		console.log(event.target.value);
		setInputValue(event.target.value);
	};

	const handleChange = (event) => {
		console.log(event.target.value);
		const numberOfDays = parseInt(event.target.value);
		console.log(typeof event.target.value);
		setSelectedOption(numberOfDays);
	};

	const handleSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			try {
				alert(`Form submitted with selected option: ${selectedOption}`);

				await addItem(listPath, {
					itemName: inputValue,
					daysUntilNextPurchase: selectedOption,
				});
				alert('Item was added to the database!', inputValue, selectedOption);
				console.log;
			} catch (error) {
				alert(`Item was not added to the database, Error: ${error.message}`);
			}
		},
		[inputValue, selectedOption, listPath],
	);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label htmlFor="item-name">
					Item Name:
					<br />
					<input
						type="text"
						defaultValue=""
						id="item-name"
						onChange={handleTextChange}
						value={inputValue}
					/>
				</label>

				<br />
				<label>
					<input
						type="radio"
						value={soonDate}
						checked={selectedOption === soonDate}
						onChange={handleChange}
					/>
					Soon
				</label>
				<br />
				<label>
					<input
						type="radio"
						value={kindOfSoonDate}
						checked={selectedOption === kindOfSoonDate}
						onChange={handleChange}
					/>
					Kind of soon
				</label>
				<br />
				<label>
					<input
						type="radio"
						value={notSoonDate}
						checked={selectedOption === notSoonDate}
						onChange={handleChange}
					/>
					Not soon
				</label>
				<br />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
