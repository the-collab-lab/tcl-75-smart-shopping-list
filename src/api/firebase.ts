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
	deleteDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './config';
import { addDaysFromToday } from '../utils';

export type ListPath = {
	[key: string]: string | null;
};

/**
 * A custom hook that subscribes to the user's shopping lists in our Firestore
 * database and returns new data whenever the lists change.
 */
export const useShoppingLists = (
	userId?: string | null,
	userEmail?: string | null,
): ListPath[] => {
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
 * @see https://firebase.google.com/docs/firestore/query-data/listen
 */
export const useShoppingListData = (
	listPath: string | null,
): DocumentData[] => {
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
 */
export const addUserToDatabase = async (user: DocumentData): Promise<void> => {
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

/**
 * Create a new list and add it to a user's lists in Firestore.
 */
export const createList = async (
	listName: string,
	userId: string,
	userEmail: string,
): Promise<string | void> => {
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

/**
 * Shares a list with another user.
 */
export const shareList = async (
	listPath: string,
	currentUserId: string,
	recipientEmail: string,
): Promise<string | void> => {
	// Check if current user is owner.
	if (!listPath?.includes(currentUserId)) {
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

/**
 * Add a new item to the user's list in Firestore.
 */
export const addItem = async (
	listPath: string,
	{
		itemName,
		daysUntilNextPurchase,
	}: {
		itemName: string;
		daysUntilNextPurchase: string;
	},
): Promise<DocumentData> => {
	const listCollectionRef = collection(db, listPath, 'items');
	return addDoc(listCollectionRef, {
		dateCreated: new Date(),
		dateLastPurchased: null,
		dateNextPurchased: addDaysFromToday(parseInt(daysUntilNextPurchase)),
		name: itemName,
		totalPurchases: 0,
	});
};

/**
 * Update an item in the user's list in Firestore with new purchase information.
 */
export const updateItem = async (
	listPath: string,
	itemId: string,
	{
		dateLastPurchased,
		dateNextPurchased,
		totalPurchases,
	}: {
		dateLastPurchased: Date;
		dateNextPurchased: Date;
		totalPurchases: number;
	},
): Promise<string | Error> => {
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

/**
 * Delete an item from the user's list in Firestore.
 */
export async function deleteItem(listPath: string, itemId: string) {
	// reference the item path
	const itemDocRef = doc(db, listPath, 'items', itemId);
	try {
		// delete the item from the database
		await deleteDoc(itemDocRef);
	} catch (error) {
		throw new Error(
			`Failed updating item: ${error instanceof Error ? error.message : error}`,
		);
	}
}
