import { useEffect, useState } from 'react';
import { auth } from '../api/config.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { addUserToDatabase } from '../api/firebase.js';
import { Button } from '@mui/material';
import { buttonStyle } from '../components/SingleList.jsx';

/**
 * A button that signs the user in using Google OAuth. When clicked,
 * the button opens a popup for the Google OAuth sign-in page.
 * After the user signs in through the popup, it closes and the user becomes signed in.
 */
export const SignInButton = () => (
	<Button
		sx={buttonStyle}
		variant="outlined"
		type="button"
		onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
	>
		Sign In
	</Button>
);

/**
 * A button that signs the user out of the app using Firebase Auth.
 */
export const SignOutButton = () => (
	<Button
		sx={buttonStyle}
		variant="outlined"
		type="button"
		onClick={() => auth.signOut()}
	>
		Sign Out
	</Button>
);

/**
 * A custom hook that listens for changes to the user's auth state.
 * Check out the Firebase docs for more info on auth listeners:
 * @see https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
 */
export const useAuth = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setUser(user);
			if (user) {
				addUserToDatabase(user);
			}
		});
	}, []);

	return { user };
};
