const getDatePinned = (listPath, importantLists) => {
	const importantList = importantLists.find((list) => list.path === listPath);
	return importantList?.datePinned;
};

export const isListImportant = (listPath, importantLists) => {
	return importantLists.some((list) => list.path === listPath);
};

export const sortByImportance = (a, b, importantLists) => {
	const aIsImportant = isListImportant(a.path, importantLists);
	const bIsImportant = isListImportant(b.path, importantLists);

	if (aIsImportant === bIsImportant) {
		// find relevant object in important lists
		const aDate = getDatePinned(a.path, importantLists);
		const bDate = getDatePinned(b.path, importantLists);

		return bDate - aDate;
	} else if (aIsImportant) {
		return -1;
	} else if (bIsImportant) {
		return 1;
	}
};
