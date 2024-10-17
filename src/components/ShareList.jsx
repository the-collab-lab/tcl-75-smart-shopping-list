import { useStateWithStorage, useAuth } from '../hooks';
import { shareList } from '../api';
import { toast } from 'react-toastify';
import { Box, Button } from '@mui/material';
import { TextInputElement } from './index.js';
import { buttonWithTopMarginStyle } from '../views/Home';

export function ShareList() {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	const shareCurrentList = async (emailData) => {
		const listShared = await shareList(listPath, userId, emailData);

		if (listShared === '!owner') {
			toast.error('You cannot share the list you do not own.');
		} else if (listShared === 'shared') {
			toast.success('List was shared with recipient.');
		} else {
			toast.error(
				"The list was not shared because the recipient's email address does not exist in the system.",
			);
		}
	};

	const handleEmailInputSubmit = (event) => {
		event.preventDefault();

		const emailData = event.target['email-input'].value;

		if (userEmail === emailData) {
			toast.error('You cannot share the list with yourself.');
		} else {
			shareCurrentList(emailData);
		}

		event.target.reset();
	};

	return (
		<Box component="section">
			<Box
				component="form"
				noValidate
				autoComplete="off"
				onSubmit={handleEmailInputSubmit}
			>
				<TextInputElement
					type="email"
					id="email-input"
					placeholder="Enter email"
					label="Share this list with a friend by entering their email:"
					required={true}
				/>
				<Button
					sx={buttonWithTopMarginStyle}
					fullWidth
					variant="outlined"
					type="submit"
				>
					Share
				</Button>
			</Box>
		</Box>
	);
}
