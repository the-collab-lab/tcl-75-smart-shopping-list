export function normalizeItemName(itemName) {
	return itemName
		.trim()
		.toLowerCase()
		.replace(/[&\/\\#, +$!,~%.'":*?<>{}]/g, '');
}
