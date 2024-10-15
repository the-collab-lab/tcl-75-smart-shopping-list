import { useState } from 'react';
import { updateItem, deleteItem } from '../api';
import { calculateDateNextPurchased, ONE_DAY_IN_MILLISECONDS } from '../utils';
import { toast } from 'react-toastify';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { DeleteIconWithTooltip } from './DeleteIconWithTooltip';
import {
	ListItem as MaterialListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Checkbox,
} from '@mui/material';

import './ListItem.css';

const currentDate = new Date();

const calculateIsPurchased = (dateLastPurchased) => {
	if (!dateLastPurchased) {
		return false;
	}
	const purchaseDate = dateLastPurchased.toDate();
	const oneDayLater = new Date(
		purchaseDate.getTime() + ONE_DAY_IN_MILLISECONDS,
	);

	return currentDate < oneDayLater;
};

export function ListItem({ item, listPath }) {
	const { open, isOpen, toggleDialog } = useConfirmDialog();
	const [isPurchased, setIsPurchased] = useState(() =>
		calculateIsPurchased(item.dateLastPurchased),
	);
	const { name, id } = item;

	const updateItemOnPurchase = () => {
		return {
			dateLastPurchased: currentDate,
			dateNextPurchased: calculateDateNextPurchased(currentDate, item),
			totalPurchases: item.totalPurchases + 1,
		};
	};

	const handleChange = async () => {
		setIsPurchased(!isPurchased);
		if (!isPurchased) {
			try {
				const updatedItem = updateItemOnPurchase();

				await updateItem(listPath, id, { ...updatedItem });
			} catch (error) {
				toast.error(`Item was not marked as purchased`, error.message);
			}
		}
	};

	const handleDeleteItem = async () => {
		console.log('attempting item deletion');
		try {
			await deleteItem(listPath, id);
			toast.success('Item deleted');
		} catch (error) {
			toast.error('Item was not deleted');
		}
		return;
	};

	const props = {
		handleDelete: handleDeleteItem,
		title: `Are you sure you want to delete ${name}?`,
		setOpen: isOpen,
		open: open,
	};

	return (
		<>
			{open && <ConfirmDialog props={props} />}
			<MaterialListItem className="ListItem">
				<ListItemButton role={undefined} onClick={handleChange} dense>
					<ListItemIcon>
						<Checkbox
							edge="start"
							checked={isPurchased}
							tabIndex={-1}
							disableRipple
							inputProps={{ 'aria-labelledby': `checkbox-label-${id}` }}
						/>
					</ListItemIcon>
					<ListItemText
						id={`checkbox-label-${id}`}
						primary={name}
						primaryTypographyProps={{ fontSize: '2rem' }}
					/>
				</ListItemButton>

				<DeleteIconWithTooltip
					toggleDialog={toggleDialog}
					aria-label="Delete item"
				/>
			</MaterialListItem>
		</>
	);
}
