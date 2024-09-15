import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../src/views/Home';
import { mockShoppingLists } from '../src/mocks/__fixtures__/shoppingLists';

describe('Home Component', () => {
	test('renders all shopping lists from fixture data', () => {
		render(
			<MemoryRouter>
				<Home data={mockShoppingLists} />
			</MemoryRouter>,
		);

		mockShoppingLists.forEach((list) => {
			expect(screen.getByText(list.name)).toBeInTheDocument();
		});
	});
});
