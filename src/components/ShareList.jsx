import { useState } from 'react';
import { shareList, useAuth } from '../api';
import { useStateWithStorage } from '../utils';

export function ShareList() {
	const [emailData, setEmailData] = useState('');
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	const handleTextChange = (event) => {
		return setEmailData(event.target.value);
	};

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
