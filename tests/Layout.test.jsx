import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '../src/views/Layout';
import { useAuth } from '../src/api/useAuth';
import { mockUser } from '../src/mocks/__fixtures__/auth';

vi.mock('../src/api/useAuth', () => ({
	useAuth: vi.fn(),
	SignInButton: () => <button>Sign In</button>,
	SignOutButton: () => <button>Sign Out</button>,
}));

describe('Layout Component', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({ user: null });
	});

	test('renders the layout with heading and navigation links', () => {
		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>,
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('List')).toBeInTheDocument();
		expect(screen.getByText('Manage List')).toBeInTheDocument();
	});

	test('renders SignInButton when user is not authenticated', () => {
		useAuth.mockReturnValue({ user: null });

		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>,
		);

		expect(screen.getByText('Sign In')).toBeInTheDocument();
	});

	test('renders SignOutButton when user is authenticated using mock data', () => {
		useAuth.mockReturnValue({ user: mockUser });

		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>,
		);

		expect(screen.getByText('Sign Out')).toBeInTheDocument();
	});
});
