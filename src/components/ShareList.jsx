import { shareList, useAuth } from '../api';
import { useStateWithStorage } from '../utils';
import TextInputElement from './TextInputElement';

export function ShareList() {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	const shareCurrentList = async (emailData) => {
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

		const emailData = event.target['email-input'].value;

		if (userEmail === emailData) {
			alert('You cannot share the list with yourself.');
		} else {
			shareCurrentList(emailData);
		}

		event.target.reset();
	};

	return (
		<div>
			<form onSubmit={handleEmailInputSubmit}>
				<TextInputElement
					type="email"
					id="email-input"
					placeholder="Enter email"
					label="Enter Email:"
					required={true}
				/>
				<button type="submit">Invite User</button>
			</form>
		</div>
	);
}
