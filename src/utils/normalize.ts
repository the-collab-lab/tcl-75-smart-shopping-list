export function normalizeItemName(itemName: string): string {
	return itemName
		.trim()
		.toLowerCase()
		.replace(/[&\/\\#, +$!,~%.'":*?<>{}]/g, '');
}
