import {
	arrayUnion,
	getDoc,
	setDoc,
	addDoc,
	collection,
	doc,
	onSnapshot,
	updateDoc,
	DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './config';
import { addDaysFromToday } from '../utils';
import { ListPath, User } from '../types/types';

export type UseShoppingListsProps = {
	userId: string | null;
	userEmail: string | null;
};

/**
 * A custom hook that subscribes to the user's shopping lists in our Firestore
 * database and returns new data whenever the lists change.
 * @param {string | null} userId
 * @param {string | null} userEmail
 * @returns
 */
export const useShoppingLists = ({
	userId,
	userEmail,
}: UseShoppingListsProps): ListPath[] => {
	// Start with an empty array for our data.
	const [data, setData] = useState<ListPath[]>([]);

	useEffect(() => {
		// If we don't have a userId or userEmail (the user isn't signed in),
		// we can't get the user's lists.
		if (!userId || !userEmail) return;

		// When we get a userEmail, we use it to subscribe to real-time updates
		const userDocRef = doc(db, 'users', userEmail);

		onSnapshot(userDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const listRefs: ListPath[] = docSnap.data().sharedLists;
				const newData = listRefs.map((listRef) => {
					// We keep the list's id and path so we can use them later.
					return { name: listRef.id, path: listRef.path };
				});
				setData(newData);
			}
		});
	}, [userId, userEmail]);

	return data;
};

/**
 * A custom hook that subscribes to a shopping list in our Firestore database
 * and returns new data whenever the list changes.
 * @param {string | null} listPath
 * @see https://firebase.google.com/docs/firestore/query-data/listen
 */
export const useShoppingListData = (listPath: string): DocumentData[] => {
	// Start with an empty array for our data.
	/** @type {import('firebase/firestore').DocumentData[]} */
	const initialState: DocumentData[] = [];
	const [data, setData] = useState(initialState);

	useEffect(() => {
		if (!listPath) return;

		// When we get a listPath, we use it to subscribe to real-time updates
		// from Firestore.
		return onSnapshot(collection(db, listPath, 'items'), (snapshot) => {
			// The snapshot is a real-time update. We iterate over the documents in it
			// to get the data.
			const nextData = snapshot.docs.map((docSnapshot) => {
				// Extract the document's data from the snapshot.
				const item = docSnapshot.data();

				// The document's id is not in the data,
				// but it is very useful, so we add it to the data ourselves.
				item.id = docSnapshot.id;

				return item;
			});

			// Update our React state with the new data.
			setData(nextData);
		});
	}, [listPath]);

	// Return the data so it can be used by our React components.
	return data;
};

/**
 * Add a new user to the users collection in Firestore.
 * @param {Object} user The user object from Firebase Auth.
 */
export const addUserToDatabase = async (user: User): Promise<void> => {
	// Check if the user already exists in the database.
	const userDoc = await getDoc(doc(db, 'users', user.email));
	// If the user already exists, we don't need to do anything.
	if (userDoc.exists()) {
		return;
	} else {
		// If the user doesn't exist, add them to the database.
		// We'll use the user's email as the document id
		// because it's more likely that the user will know their email
		// than their uid.
		await setDoc(doc(db, 'users', user.email), {
			email: user.email,
			name: user.displayName,
			uid: user.uid,
		});
	}
};

export type CreateListProps = {
	userId: string;
	userEmail: string;
	listName: string;
};

/**
 * Create a new list and add it to a user's lists in Firestore.
 * @param {string} userId The id of the user who owns the list.
 * @param {string} userEmail The email of the user who owns the list.
 * @param {string} listName The name of the new list.
 */
export const createList = async ({
	userId,
	userEmail,
	listName,
}: CreateListProps): Promise<string> => {
	const listDocRef = doc(db, userId, listName);

	await setDoc(listDocRef, {
		owner: userId,
	});

	const userDocumentRef = doc(db, 'users', userEmail);

	updateDoc(userDocumentRef, {
		sharedLists: arrayUnion(listDocRef),
	});
	return listDocRef.path;
};

export type ShareListProps = {
	listPath: string;
	currentUserId: string;
	recipientEmail: string;
};

/**
 * Shares a list with another user.
 * @param {string} listPath The path to the list to share.
 * @param {string} recipientEmail The email of the user to share the list with.
 */
export const shareList = async ({
	listPath,
	currentUserId,
	recipientEmail,
}: ShareListProps): Promise<string | void> => {
	// Check if current user is owner.
	if (!listPath.includes(currentUserId)) {
		return '!owner';
	}
	// Get the document for the recipient user.
	const usersCollectionRef = collection(db, 'users');
	const recipientDoc = await getDoc(doc(usersCollectionRef, recipientEmail));
	// If the recipient user doesn't exist, we can't share the list.
	if (!recipientDoc.exists()) {
		return;
	}
	// Add the list to the recipient user's sharedLists array.
	const listDocumentRef = doc(db, listPath);
	const userDocumentRef = doc(db, 'users', recipientEmail);
	try {
		updateDoc(userDocumentRef, {
			sharedLists: arrayUnion(listDocumentRef),
		});
		return 'shared';
	} catch {
		return;
	}
};

export type AddItemProps = {
	listPath: string;
	itemData: {
		itemName: string;
		daysUntilNextPurchase: number;
	};
};

/**
 * Add a new item to the user's list in Firestore.
 * @param {string} listPath The path of the list we're adding to.
 * @param {Object} itemData Information about the new item.
 * @param {string} itemData.itemName The name of the item.
 * @param {number} itemData.daysUntilNextPurchase The number of days until the user thinks they'll need to buy the item again.
 */
export const addItem = async ({
	listPath,
	itemData: { itemName, daysUntilNextPurchase },
}: AddItemProps): Promise<DocumentData> => {
	const listCollectionRef = collection(db, listPath, 'items');
	return addDoc(listCollectionRef, {
		dateCreated: new Date(),
		dateLastPurchased: null,
		dateNextPurchased: addDaysFromToday(daysUntilNextPurchase),
		name: itemName,
		totalPurchases: 0,
	});
};

export type UpdateItemProps = {
	listPath: string;
	itemId: string;
	updatedData: {
		dateLastPurchased: Date;
		dateNextPurchased: Date;
		totalPurchases: number;
	};
};

/**
 * Update an item in the user's list in Firestore with new purchase information.
 * @param {string} listPath The path of the list the item belongs to.
 * @param {string} itemId The ID of the item being updated.
 * @param {Object} updatedData Object containing the updated item data.
 * @param {Date} updatedData.dateLastPurchased The date the item was last purchased.
 * @param {Date} updatedData.dateNextPurchased The estimated date for the next purchase.
 * @param {number} updatedData.totalPurchases The total number of times the item has been purchased.
 * @returns {Promise<string>} A message confirming the item was successfully updated.
 * @throws {Error} If the item update fails.
 */
export const updateItem = async ({
	listPath,
	itemId,
	updatedData: { dateLastPurchased, dateNextPurchased, totalPurchases },
}: UpdateItemProps): Promise<string | Error> => {
	// reference the item path
	const itemDocRef = doc(db, listPath, 'items', itemId);
	// update the item with the purchase date and increment the total purchases made
	try {
		await updateDoc(itemDocRef, {
			dateLastPurchased,
			dateNextPurchased,
			totalPurchases,
		});
		return 'item purchased';
	} catch (error) {
		throw new Error(
			`Failed updating item: ${error instanceof Error ? error.message : error}`,
		);
	}
};

export async function deleteItem() {
	/**
	 * TODO: Fill this out so that it uses the correct Firestore function
	 * to delete an existing item. You'll need to figure out what arguments
	 * this function must accept!
	 */
}
