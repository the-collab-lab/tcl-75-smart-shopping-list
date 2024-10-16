import { useCallback } from 'react';
import { useStateWithStorage } from '../hooks';
import { addItem } from '../api';
import { normalizeItemName } from '../utils';
import { RadioInputElement, TextInputElement } from './index.js';
import { toast } from 'react-toastify';
import { Box, Button, FormControl, RadioGroup } from '@mui/material';
import { buttonStyle } from '../views';

const radioGroupStyle = {
	mx: 1,
	justifyContent: 'space-between',
};

const daysUntilPurchaseOptions = {
	Soon: 7,
	'Kind of soon': 14,
	'Not soon': 30,
};

export function AddItems({ items }) {
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const handleSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			const daysUntilNextPurchase =
				event.target.elements['purchase-date'].value;

			const itemName = event.target.elements['item-name'].value;

			try {
				if (itemName.trim() === '') {
					toast.error('Please add an item name.');
					return;
				}
				// normalize the name by removing all punctuation and spaces to check if the normalized item is already in the list
				const normalizedItemName = normalizeItemName(itemName);
				if (items) {
					// normalize the existing list items to compare them to the new input
					const currentItems = items.map((item) =>
						normalizeItemName(item.name),
					);
					if (currentItems.includes(normalizedItemName)) {
						toast.error('This item already exists in the list');
						return;
					}
				}
				await addItem(listPath, {
					itemName,
					daysUntilNextPurchase,
				});
				toast.success(
					`${itemName} was added to the list! The next purchase date is set to ${daysUntilNextPurchase} days from now.`,
				);
			} catch (error) {
				toast.error(
					`Item was not added to the database, Error: ${error.message}`,
				);
			} finally {
				event.target.reset();
			}
		},
		[listPath],
	);

	return (
		<Box component="section">
			<Box
				component="form"
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<TextInputElement
					type="text"
					id="item-name"
					placeholder="Item name"
					label="Add item:"
					required={true}
				/>
				<FormControl fullWidth required>
					<RadioGroup
						aria-labelledby="purchase-date-radios"
						name="purchase-date"
						sx={radioGroupStyle}
						row
					>
						{Object.entries(daysUntilPurchaseOptions).map(([key, value]) => (
							<RadioInputElement
								key={key}
								label={key}
								id={key}
								value={value}
								required={true}
							/>
						))}
					</RadioGroup>
				</FormControl>

				<Button sx={buttonStyle} fullWidth variant="outlined" type="submit">
					Submit
				</Button>
			</Box>
		</Box>
	);
}
