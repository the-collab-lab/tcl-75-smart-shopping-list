import {
	arrayUnion,
	arrayRemove,
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
	userId: string,
	userEmail: string,
	listName: string,
): Promise<string> => {
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
): Promise<boolean> => {
	// Check if current user is owner.
	if (!listPath?.includes(currentUserId)) {
		throw new Error('You cannot share the list you do not own.');
	}
	// Get the document for the recipient user.
	const usersCollectionRef = collection(db, 'users');
	const recipientDoc = await getDoc(doc(usersCollectionRef, recipientEmail));
	// If the recipient user doesn't exist, we can't share the list.
	if (!recipientDoc.exists()) {
		throw new Error(
			"The list was not shared because the recipient's email address does not exist in the system.",
		);
	}
	// Add the list to the recipient user's sharedLists array.
	const listDocumentRef = doc(db, listPath);
	const userDocumentRef = doc(db, 'users', recipientEmail);
	try {
		updateDoc(userDocumentRef, {
			sharedLists: arrayUnion(listDocumentRef),
		});
		return true;
	} catch (error) {
		throw new Error(
			`List was not shared: ${error instanceof Error ? error.message : error}`,
		);
	}
};

/**
 * Delete a list from a user's lists in Firestore.
 * - If the deletion type is 'soft', the list will be removed from the user's view but not deleted from Firestore.
 * - If the deletion type is 'hard', the list will be permanently deleted from Firestore and removed from the user's view.
 *
 * @param {string} deletionType - The type of deletion ('soft' or 'hard').
 * @param {string} listPath - The path to the list document in Firestore.
 * @param {string} userId - The id of the user who owns the list.
 * @param {string} userEmail - The email of the user who has the list in their shared lists.
 * @returns {Promise<string>} A message indicating the result of the deletion operation.
 * @throws {Error} If something goes wrong during the deletion process.
 */
export async function deleteList(deletionType, listPath, userId, userEmail) {
	const listDocRef = doc(db, listPath);
	const userDocRef = doc(db, 'users', userEmail);

	try {
		await updateDoc(userDocRef, {
			sharedLists: arrayRemove(listDocRef),
		});

		if (deletionType === 'hard') {
			await deleteDoc(listDocRef);
		}
	} catch (error) {
		throw new Error(`Something went wrong: ${error.message ?? error}`);
	}
}

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
