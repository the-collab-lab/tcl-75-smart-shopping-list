/* eslint-disable jsx-a11y/anchor-is-valid */
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth, SignInButton, SignOutButton } from '../hooks/useAuth';
// import { Home, List, ManageList } from '../views';

import './Layout.css';

/**
 * TODO: The links defined in this file don't work!
 *
 * Instead of anchor element, they should use a component
 * from `react-router-dom` to navigate to the routes
 * defined in `App.jsx`.
 */

export function Layout() {
	const { user } = useAuth();

	return (
		<>
			<div className="Layout">
				<a>{user ? <SignOutButton /> : <SignInButton />}</a>
				<main className="Layout-main">
					<Outlet />
				</main>
				<nav className="Nav">
					<div className="Nav-container">
						<div className="App-title">Shopping List</div>
						<NavLink to="/" end className="Nav-link">
							Home
						</NavLink>
						<NavLink to="/list" className="Nav-link">
							List
						</NavLink>
						<NavLink to="/manage-list" className="Nav-link">
							Manage List
						</NavLink>
					</div>
				</nav>
			</div>
		</>
	);
}
