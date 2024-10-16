import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home, Layout, List, ManageList } from './views';

import { useAuth, useShoppingListData, useStateWithStorage } from './hooks';
import { useShoppingLists } from './api';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
	/**
	 * This custom hook takes the path of a shopping list
	 * in our database and syncs it with localStorage for later use.
	 * Check ./utils/hooks.js for its implementation.
	 *
	 * We'll later use `setListPath` when we allow a user
	 * to create and switch between lists.
	 */
	const [listPath, setListPath] = useStateWithStorage(
		'tcl-shopping-list-path',
		null,
	);

	/**
	 * This custom hook holds info about the current signed in user.
	 * Check ./api/useAuth.jsx for its implementation.
	 */
	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	/**
	 * This custom hook takes a user ID and email and fetches
	 * the shopping lists that the user has access to.
	 * Check ./api/firestore.js for its implementation.
	 */
	const lists = useShoppingLists(userId, userEmail);
	/**
	 * This custom hook takes our token and fetches the data for our list.
	 * Check ./api/firestore.js for its implementation.
	 */
	const data = useShoppingListData(listPath);

	return (
		<Router>
			<ToastContainer
				position="top-center"
				autoClose={4000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				draggable
				pauseOnHover
				theme="dark"
			/>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route
						index
						element={
							<Home
								data={lists}
								setListPath={setListPath}
								userId={userId}
								userEmail={userEmail}
							/>
						}
					/>
					<Route
						path="/list"
						element={<List data={data} listPath={listPath} />}
					/>
					<Route path="/manage-list" element={<ManageList items={data} />} />
				</Route>
			</Routes>
		</Router>
	);
}
