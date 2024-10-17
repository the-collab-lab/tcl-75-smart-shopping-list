import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { List } from '../src/views/List';
import { mockShoppingListData } from '../src/mocks/__fixtures__/shoppingListData';
import { useStateWithStorage, useEnsureListPath } from '../src/hooks';
import {
	getDateLastPurchasedOrDateCreated,
	getDaysFromDate,
	getDaysBetweenDates,
} from '../src/utils';

vi.mock('../src/hooks', () => ({
	useEnsureListPath: vi.fn(),
	useStateWithStorage: vi.fn(),
	useEnsureListPath: vi.fn(),
	useUrgency: vi.fn(() => ({
		getUrgency: vi.fn((name) => {
			if (name === 'nutella') return 'soon';
			if (name === 'Cheese') return 'overdue';
			return 'notSoon';
		}),
		urgencyObject: {
			overdue: [{ name: 'nutella', id: '0T1ByXr8YJSOzujOlLMI' }],
			soon: [{ name: 'Cheese', id: '1MFWOWMCzDtEHQboFZfR' }],
			kindOfSoon: [],
			notSoon: [{ name: 'Jam', id: 'MnUiYUmhg8iCzX1eMxW8' }],
			inactive: [],
		},
	})),
}));

vi.mock('../src/utils', () => ({
	ONE_DAY_IN_MILLISECONDS: 86400000,
	getDateLastPurchasedOrDateCreated: vi.fn(),
	getDaysFromDate: vi.fn(),
	getDaysBetweenDates: vi.fn(),
}));

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

	vi.spyOn(window, 'alert').mockImplementation(() => {});
	useStateWithStorage.mockReturnValue(['/groceries']);
	getDateLastPurchasedOrDateCreated.mockReturnValue(new Date());
	getDaysFromDate.mockReturnValue(10);
	getDaysBetweenDates.mockReturnValue(5);
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

	test('triggers alert and redirects when no list path is found in localStorage', () => {
		window.localStorage.getItem.mockReturnValueOnce(null);

		useEnsureListPath.mockImplementation(() => {
			window.alert(
				'It seems like you landed here without first creating a list or selecting an existing one. Please select or create a new list first. Redirecting to Home.',
			);
			return true;
		});

		render(
			<MemoryRouter>
				<List data={[]} listPath={null} />
			</MemoryRouter>,
		);

		expect(window.alert).toHaveBeenCalledWith(
			'It seems like you landed here without first creating a list or selecting an existing one. Please select or create a new list first. Redirecting to Home.',
		);
	});
});
