import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDmGxC-ITYFOyD6U1IrJAszf1KplXbG1Bs',
	authDomain: 'tcl-75-smart-shopping-list.firebaseapp.com',
	projectId: 'tcl-75-smart-shopping-list',
	storageBucket: 'tcl-75-smart-shopping-list.appspot.com',
	messagingSenderId: '1081566633611',
	appId: '1:1081566633611:web:b07badada6839daf2e3e8e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
