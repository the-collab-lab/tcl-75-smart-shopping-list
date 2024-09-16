export type Item = {
	dateCreated: Date;
	dateLastPurchased: Date | null;
	dateNextPurchased: Date;
	name: string;
	totalPurchases: number;
};

export type User = {
	email: string;
	name: string;
	uid: number;
};
