import { useEffect, useState } from 'react';
import { sortByImportance, isListImportant } from '../utils';

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
		const sortedByImportance = [...lists].sort((a, b) =>
			sortByImportance(a, b, importantLists),
		);
		setSortedLists(sortedByImportance);
	}, [lists, importantLists]);

	// This function updates the list of important lists:
	// it adds the list to local storage if marked as important,
	// or removes the list from local storage if unmarked as important.
	const setImportantList = (listPath) => {
		// check if the list is already marked as important
		const found = isListImportant(listPath, importantLists);
		// initialize an array that will store new important lists
		let newLists = [];

		// if the list is already marked as important
		if (found) {
			// filter out the selected list to unmark it as important
			newLists = [...importantLists].filter((list) => list.path !== listPath);
			// if the list was not marked as important
		} else {
			// push the new important list with the current date to the beginning of the array
			newLists = [
				{ datePinned: new Date(), path: listPath },
				...importantLists,
			];
		}

		// update state with new important lists
		setImportantLists(newLists);
		// save updated important lists to local storage
		localStorage.setItem('importantLists', JSON.stringify(newLists));
	};

	return {
		sortedLists,
		setImportantList,
		isListImportant: (path) => isListImportant(path, importantLists),
	};
}
