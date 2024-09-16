import { shareList, useAuth } from '../api';
import { useStateWithStorage } from '../utils';
import TextInputElement from './TextInputElement';

export function ShareList() {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	const shareCurrentList = async (emailData: string) => {
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

	const handleEmailInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const emailData = (
			form.elements.namedItem('email-input') as HTMLInputElement
		).value;

		if (userEmail === emailData) {
			alert('You cannot share the list with yourself.');
		} else {
			shareCurrentList(emailData);
		}

		form.reset();
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
