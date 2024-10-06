import { render, screen } from '@testing-library/react';
import { ManageList } from '../src/views/ManageList';
import { MemoryRouter } from 'react-router-dom';

describe('ManageList Component', () => {
	test('renders AddItems component with submit button and radio buttons', () => {
		render(
			<MemoryRouter>
				<ManageList />
			</MemoryRouter>,
		);

		expect(screen.getByLabelText('Item Name:')).toBeInTheDocument();
		expect(screen.getByLabelText('Soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Kind of soon')).toBeInTheDocument();
		expect(screen.getByLabelText('Not soon')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});

	test('renders ShareList component with email input and invite button', () => {
		render(
			<MemoryRouter>
				<ManageList />
			</MemoryRouter>,
		);

		expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
		expect(screen.getByText('Invite User')).toBeInTheDocument();
	});
});
