import './Layout.css';
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth, SignInButton, SignOutButton } from '../api/useAuth';

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
				<header className="Layout-header">
					<h1>Smart shopping list</h1>
				</header>
				<a>{user ? <SignOutButton /> : <SignInButton />}</a>
				<main className="Layout-main">
					<Outlet />
				</main>
				<nav className="Nav">
					<div className="Nav-container">{navLinks}</div>
				</nav>
			</div>
		</>
	);
}
