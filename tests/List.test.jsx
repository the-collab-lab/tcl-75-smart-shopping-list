import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { List } from '../src/views/List';
import { mockShoppingListData } from '../src/mocks/__fixtures__/shoppingListData';

beforeEach(() => {
	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: vi.fn((key) => {
				if (key === 'tcl-shopping-list-path') {
					return '/groceries';
				}
				return null;
			}),
			setItem: vi.fn(),
			clear: vi.fn(),
		},
		writable: true,
	});
});

describe('List Component', () => {
	test('renders the shopping list name, search field, and all list items from the data prop', () => {
		render(
			<MemoryRouter>
				<List data={mockShoppingListData} listPath={'/groceries'} />
			</MemoryRouter>,
		);

		expect(screen.getByText('groceries')).toBeInTheDocument();
		expect(screen.getByLabelText('Search Item:')).toBeInTheDocument();

		mockShoppingListData.forEach((item) => {
			expect(screen.getByText(item.name)).toBeInTheDocument();
		});
	});

	test('shows AddItems component with existing items', () => {
		render(
			<MemoryRouter>
				<List data={mockShoppingListData} listPath={'/groceries'} />
			</MemoryRouter>,
		);

		expect(screen.getByLabelText('Item Name:')).toBeInTheDocument();
		expect(screen.getByLabelText('Soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Kind of soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Not soon')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});

	test('shows welcome message and AddItems component when no items are present', () => {
		render(
			<MemoryRouter>
				<List data={[]} listPath={'/groceries'} />
			</MemoryRouter>,
		);

		expect(screen.getByText('Welcome to groceries!')).toBeInTheDocument();
		expect(screen.getByLabelText('Item Name:')).toBeInTheDocument();
		expect(screen.getByLabelText('Soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Kind of soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Not soon')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});
});
