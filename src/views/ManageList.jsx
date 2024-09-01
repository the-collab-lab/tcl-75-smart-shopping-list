import { useCallback, useState } from 'react';
import { useStateWithStorage } from '../utils';
import { addItem, shareList, useAuth } from '../api';

const soonDate = 7;
const kindOfSoonDate = 14;
const notSoonDate = 30;

export function ManageList() {
	const [daysUntilNextPurchase, setDaysUntilNextPurchase] = useState(null);
	const [itemName, setItemName] = useState('');
	const [emailData, setEmailData] = useState('');

	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	const handleTextChange = (event) => {
		switch (event.target.id) {
			case 'item-name':
				return setItemName(event.target.value);
			case 'email-input':
				return setEmailData(event.target.value);
		}
	};

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
					'Item was added to the database!',
					itemName,
					daysUntilNextPurchase,
				);
			} catch (error) {
				alert(`Item was not added to the database, Error: ${error.message}`);
			}
		},
		[itemName, daysUntilNextPurchase, listPath],
	);

	const shareCurrentList = async () => {
		const listShared = await shareList(listPath, userId, emailData);

		if (listShared === '!owner') {
			alert('You cannot share the list you do not own.');
		} else if (listShared === 'shared') {
			alert('List was shared with recipient.');
		} else {
			alert(
				"The list was not shared because the recipient's email address does not exist in the system.",
			);
		}
	};

	const handleEmailInputSubmit = (event) => {
		event.preventDefault();

		if (userEmail === emailData) {
			alert('You cannot share the list with yourself.');
		} else {
			shareCurrentList();
		}

		setEmailData('');
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label htmlFor="item-name">
					Item Name:
					<br />
					<input
						type="text"
						id="item-name"
						onChange={handleTextChange}
						value={itemName}
					/>
				</label>

				<br />
				<label>
					<input
						type="radio"
						value={soonDate}
						checked={daysUntilNextPurchase === soonDate}
						onChange={handleChange}
					/>
					Soon
				</label>
				<br />
				<label>
					<input
						type="radio"
						value={kindOfSoonDate}
						checked={daysUntilNextPurchase === kindOfSoonDate}
						onChange={handleChange}
					/>
					Kind of soon
				</label>
				<br />
				<label>
					<input
						type="radio"
						value={notSoonDate}
						checked={daysUntilNextPurchase === notSoonDate}
						onChange={handleChange}
					/>
					Not soon
				</label>
				<br />
				<button type="submit">Submit</button>
			</form>

			{/* invite a user to share list form */}
			<form onSubmit={handleEmailInputSubmit}>
				<label htmlFor="email-input">Enter Email:</label>
				<input
					type="email"
					id="email-input"
					value={emailData}
					placeholder="Enter email"
					required
					onChange={handleTextChange}
				/>
				<br />
				<button type="submit">Invite User</button>
			</form>
		</div>
	);
}
