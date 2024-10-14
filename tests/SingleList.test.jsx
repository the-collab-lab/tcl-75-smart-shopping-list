import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SingleList } from '../src/components/SingleList';
import { deleteList } from '../src/api';
import {
	mockSingleListItem,
	mockSetImportantList,
	mockSetListPath,
} from '../src/mocks/__fixtures__/singleListData';
import { mockUser } from '../src/mocks/__fixtures__/auth';

vi.mock('../src/api', () => ({
	deleteList: vi.fn(),
	useAuth: () => ({
		user: { uid: mockUser.uid, email: mockUser.email },
	}),
}));

describe('SingleList component', () => {
	test('calls deleteList function', async () => {
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

		const deleteIcon = screen.getByTestId('DeleteOutlineOutlinedIcon');
		await userEvent.click(deleteIcon);
		const confirmDialog = await screen.findByText(
			`Are you sure you want to delete ${mockSingleListItem.name}?`,
		);
		expect(confirmDialog).toBeInTheDocument();

		const confirmButton = screen.getByText('Confirm');
		await userEvent.click(confirmButton);

		expect(deleteList).toHaveBeenCalledWith(
			'soft',
			mockSingleListItem.path,
			mockUser.uid,
			mockUser.email,
		);
	});
});
