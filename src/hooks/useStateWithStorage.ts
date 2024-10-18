import { useEffect, useState } from 'react';

/**
 * Set some state in React, and also persist that value in localStorage.
 */
export function useStateWithStorage(
	storageKey: string,
	initialValue: string,
): [string, React.Dispatch<string>] {
	const [value, setValue] = useState(
		() => localStorage.getItem(storageKey) ?? initialValue,
	);
	useEffect(() => {
		if (value === undefined) {
			return localStorage.removeItem(storageKey);
		}
		return localStorage.setItem(storageKey, value);
	}, [storageKey, value]);

	return [value, setValue];
}
