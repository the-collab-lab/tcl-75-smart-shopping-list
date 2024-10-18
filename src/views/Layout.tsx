import './Layout.css';
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth, SignInButton, SignOutButton } from '../hooks/useAuth';

const navLinkOptions: { [key: string]: string } = {
	'/': 'Home',
	'/list': 'List',
	'/manage-list': 'Manage List',
};

const navLinks = Object.entries(navLinkOptions).map(([path, linkText]) => (
	<NavLink key={linkText} to={path} end className="Nav-link">
		{linkText}
	</NavLink>
));

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
						<div className="Nav-container">{navLinks}</div>
					</div>
				</nav>
			</div>
		</>
	);
}
