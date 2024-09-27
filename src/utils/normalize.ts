import { DocumentData } from 'firebase/firestore';

export function normalizeItemName(itemName: string): string {
	return itemName
		.trim()
		.toLowerCase()
		.replace(/[&\/\\#, +$!,~%.'":*?<>{}]/g, '');
}

export function normalizeAndVerifyItem(
	items: DocumentData[],
	itemName: string,
) {
	const normalizedItemName = normalizeItemName(itemName);

	// normalize the existing list items to compare them to the new input
	const currentItems = items.map((item) => {
		return normalizeItemName(item.name);
	});

	if (currentItems.includes(normalizedItemName)) {
		throw new Error('This item already exists in the list');
	}

	return normalizedItemName;
}
