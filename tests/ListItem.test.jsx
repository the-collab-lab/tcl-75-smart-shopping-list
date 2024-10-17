import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { userEvent } from '@testing-library/user-event';
import { ListItem } from '../src/components/ListItem';
import { mockShoppingListData } from '../src/mocks/__fixtures__/shoppingListData';

describe('ListItem Component', () => {
	test('displays additional item information if More Information button is clicked', async () => {
		render(
			<MemoryRouter>
				<ListItem
					item={mockShoppingListData[1]}
					listPath={'/groceries'}
					itemUrgencyStatus="overdue"
				/>
			</MemoryRouter>,
		);

		const moreInformationIcon = screen.getByTestId('MoreHorizIcon');
		await userEvent.click(moreInformationIcon);

		expect(screen.getByText(mockShoppingListData[1].name)).toBeInTheDocument();
		expect(
			screen.getByText(
				`Item added on: ${mockShoppingListData[1].dateCreated.toDate().toLocaleString()}`,
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				`Last bought on: ${mockShoppingListData[1].dateLastPurchased.toDate().toLocaleString()}`,
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				`Expected to buy again by: ${mockShoppingListData[1].dateNextPurchased.toDate().toLocaleString()}`,
			),
		).toBeInTheDocument();
	});
});
