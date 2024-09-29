import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { List } from '../src/views/List';
import {
	mockShoppingListData,
	mockUrgencyObject,
} from '../src/mocks/__fixtures__/shoppingListData';
import {
	useStateWithStorage,
	getDateLastPurchasedOrDateCreated,
	getDaysBetweenDates,
	getDaysFromDate,
	comparePurchaseUrgency,
} from '../src/utils';

vi.mock('../src/utils', () => ({
	useStateWithStorage: vi.fn(),
	ONE_DAY_IN_MILLISECONDS: 86400000,
	getDateLastPurchasedOrDateCreated: vi.fn(),
	getDaysFromDate: vi.fn(),
	comparePurchaseUrgency: vi.fn(),
	getDaysBetweenDates: vi.fn(),
	useUrgency: vi.fn().mockReturnValue({
		getUrgency: vi.fn(),
		urgencyObject: mockUrgencyObject,
	}),
}));

beforeEach(() => {
	useStateWithStorage.mockReturnValue(['/groceries']);
	getDateLastPurchasedOrDateCreated.mockReturnValue(new Date());
	getDaysFromDate.mockReturnValue(10);
	comparePurchaseUrgency.mockReturnValue(1);
	getDaysBetweenDates.mockReturnValue(5);
});

describe('List Component', () => {
	test('renders the shopping list name, search field, and all list items from the data prop', () => {
		render(<List data={mockShoppingListData} listPath={'/groceries'} />);

		expect(screen.getByText('groceries')).toBeInTheDocument();
		expect(screen.getByLabelText('Search Item:')).toBeInTheDocument();

		mockShoppingListData.forEach((item) => {
			expect(screen.getByText(item.name)).toBeInTheDocument();
		});
	});

	test('shows welcome message and AddItems component when no items are present', () => {
		render(<List data={[]} listPath={'/groceries'} />);

		expect(screen.getByText('Welcome to groceries!')).toBeInTheDocument();
		expect(screen.getByLabelText('Item Name:')).toBeInTheDocument();
		expect(screen.getByLabelText('Soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Kind of soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Not soon')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});
});
