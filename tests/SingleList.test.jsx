import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SingleList } from '../src/components/SingleList';
import {
	mockSingleListItem,
	mockSetImportantList,
	mockSetListPath,
} from '../src/mocks/__fixtures__/singleListData';

describe('SingleList component', () => {
	test('hovers delete icon', async () => {
		render(
			<MemoryRouter>
				<SingleList
					item={mockSingleListItem}
					setListPath={mockSetListPath}
					isImportant={false}
					setImportantList={mockSetImportantList}
				/>
			</MemoryRouter>,
		);

		const listItem = screen.getByRole('listitem');
		await userEvent.hover(listItem);

		expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
	});
});
