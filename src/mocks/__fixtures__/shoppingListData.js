// This file contains mock data for shopping lists with Firestore-like timestamps that include a toDate() method.
export const mockUrgencyObject = {
	overdue: [],
	soon: [],
	kindOfSoon: [],
	notSoon: [],
	inactive: [],
};

export const mockShoppingListData = [
	{
		name: 'nutella',
		dateNextPurchased: {
			toDate: () => new Date('2024-01-01T10:00:00Z'),
		},
		dateLastPurchased: {
			toDate: () => new Date('2023-12-01T10:00:00Z'),
		},
		totalPurchases: 6,
		dateCreated: {
			toDate: () => new Date('2023-11-01T10:00:00Z'),
		},
		id: '0T1ByXr8YJSOzujOlLMI',
	},
	{
		name: 'Cheese',
		dateNextPurchased: {
			toDate: () => new Date('2024-01-05T10:00:00Z'),
		},
		dateLastPurchased: {
			toDate: () => new Date('2023-12-05T12:00:00Z'),
		},
		totalPurchases: 3,
		dateCreated: {
			toDate: () => new Date('2023-11-05T12:00:00Z'),
		},
		id: '1MFWOWMCzDtEHQboFZfR',
	},
	{
		name: 'Jam',
		dateNextPurchased: {
			toDate: () => new Date('2024-01-10T12:00:00Z'),
		},
		dateLastPurchased: {
			toDate: () => new Date('2023-12-10T12:00:00Z'),
		},
		totalPurchases: 4,
		dateCreated: {
			toDate: () => new Date('2023-11-10T12:00:00Z'),
		},
		id: 'MnUiYUmhg8iCzX1eMxW8',
	},
];
