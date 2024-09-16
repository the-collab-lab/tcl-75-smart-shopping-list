export type Item = {
	id: string;
	listPath: string;
	dateCreated: Date;
	dateLastPurchased: Date | null;
	dateNextPurchased: Date;
	name: string;
	totalPurchases: number;
};

export type ListPath = {
	[key: string]: string;
};
