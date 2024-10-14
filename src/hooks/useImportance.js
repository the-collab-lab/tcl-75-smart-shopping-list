import { useEffect, useState } from 'react';

/**
 * A custom hook that manages the importance of lists and sorts them accordingly.
 * @param {Array<Object>} lists - An array of list objects to manage, each containing at least a `path` property.
 * @returns {Object} An object containing:
 *  - {Array<Object>} sortedLists - An array of lists sorted by importance and date they were pinned.
 *  - {Function} setImportantList - A function to toggle the importance of a list identified by its `path`.
 *  - {Function} isListImportant - A function to check if a given list is marked as important.
 */
export function useImportance(lists) {
	const [sortedLists, setSortedLists] = useState([]);
	const [importantLists, setImportantLists] = useState(
		() => JSON.parse(localStorage.getItem('importantLists')) || [],
	);

	useEffect(() => {
		const sortedByImportance = [...lists].sort(sortByImportance);
		setSortedLists(sortedByImportance);
	}, [lists, importantLists]);

	const setImportantList = (listPath) => {
		const found = isListImportant(listPath);
		let newLists = [];

		if (found) {
			newLists = [...importantLists].filter((list) => list.path !== listPath);
		} else {
			newLists = [
				{ datePinned: new Date(), path: listPath },
				...importantLists,
			];
		}

		setImportantLists(newLists);
		localStorage.setItem('importantLists', JSON.stringify(newLists));
	};

	const getDatePinned = (listPath) => {
		const importantList = importantLists.find((list) => list.path === listPath);
		return importantList?.datePinned;
	};

	const sortByImportance = (a, b) => {
		const aIsImportant = isListImportant(a.path);
		const bIsImportant = isListImportant(b.path);

		if (aIsImportant === bIsImportant) {
			// find relevant object in important lists
			const aDate = getDatePinned(a.path);
			const bDate = getDatePinned(b.path);

			return bDate - aDate;
		} else if (aIsImportant) {
			return -1;
		} else if (bIsImportant) {
			return 1;
		}
	};

	const isListImportant = (listPath) => {
		return importantLists.some((list) => list.path === listPath);
	};

	return { sortedLists, setImportantList, isListImportant };
}
