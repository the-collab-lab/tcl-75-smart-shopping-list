export type Item = {
	id: string;
	listPath: string;
	dateCreated: Date;
	dateLastPurchased: Date | null;
	dateNextPurchased: Date;
	name: string;
	totalPurchases: number;
};

export type User = {
	email: string | null;
	displayName: string | null;
	uid: string | null;
};

export type ListPath = {
	[key: string]: string;
};
