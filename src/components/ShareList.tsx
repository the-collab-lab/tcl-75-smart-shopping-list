import { shareList, useAuth } from '../api';
import { useStateWithStorage } from '../utils';
import { TextInputElement } from '../components';

export function ShareList() {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', '/');

	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	const shareCurrentList = async (emailData: string) => {
		if (!userId || !listPath) return;
		try {
			const listShared = await shareList(listPath, userId, emailData);

			if (listShared) {
				alert('List was shared with recipient.');
			}
		} catch (error) {
			alert(
				error instanceof Error
					? error.message
					: 'An error occurred while sharing the list.',
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
