import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
 * This custom hook ensures that a user has a list path in localStorage.
 * If not, it shows a user-friendly notification and redirects to the home page.
 */

export function useEnsureListPath() {
	const navigate = useNavigate();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const listPath = localStorage.getItem('tcl-shopping-list-path');
		if (!listPath) {
			alert(
				'It seems like you landed here without first creating a list or selecting an existing one. Please select or create a new list first. Redirecting to Home.',
			);
			navigate('/');
		} else {
			setIsChecking(false);
		}
	}, [navigate]);

	return isChecking;
}
