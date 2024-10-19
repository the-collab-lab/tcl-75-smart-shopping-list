import { useState } from 'react';
import { updateItem, deleteItem } from '../api';
import { calculateDateNextPurchased, ONE_DAY_IN_MILLISECONDS } from '../utils';
import { toast } from 'react-toastify';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { DeleteIconWithTooltip, ConfirmDialog, tooltipStyle } from './index';
import {
	ListItem as MaterialListItem,
	Tooltip,
	IconButton,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Checkbox,
} from '@mui/material';
import {
	Restore as OverdueIcon,
	RestartAlt as SoonIcon,
	RadioButtonUnchecked as KindOfSoonIcon,
	RemoveCircle as NotSoonIcon,
	RadioButtonChecked as InactiveIcon,
} from '@mui/icons-material';

import './ListItem.css';

const currentDate = new Date();

const urgencyStatusIcons = {
	overdue: OverdueIcon,
	soon: SoonIcon,
	'kind of soon': KindOfSoonIcon,
	'not soon': NotSoonIcon,
	inactive: InactiveIcon,
};

const urgencyStatusStyle = {
	fontSize: '2.5rem',
	color: 'white',
};

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

export function ListItem({ item, listPath, itemUrgencyStatus }) {
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
		try {
			await deleteItem(listPath, id);
			toast.success('Item deleted');
		} catch (error) {
			toast.error('Item was not deleted');
		}
		return;
	};

	const UrgencyStatusIcon = urgencyStatusIcons[itemUrgencyStatus];

	const props = {
		handleDelete: handleDeleteItem,
		title: `Are you sure you want to delete ${name}?`,
		setOpen: isOpen,
		open,
	};

	const tooltipTitle = isPurchased
		? 'Mark as not purchased'
		: 'Mark as purchased';

	return (
		<>
			{open && <ConfirmDialog props={props} />}
			<MaterialListItem className="ListItem">
				{UrgencyStatusIcon && (
					<Tooltip
						title={<p style={tooltipStyle}>{itemUrgencyStatus}</p>}
						placement="left"
						arrow
					>
						<IconButton aria-label={itemUrgencyStatus}>
							<UrgencyStatusIcon sx={urgencyStatusStyle} fontSize="large" />
						</IconButton>
					</Tooltip>
				)}
				<ListItemButton role={undefined} onClick={handleChange} dense>
					<ListItemIcon>
						<Tooltip
							title={<p style={tooltipStyle}>{tooltipTitle}</p>}
							placement="left"
							arrow
						>
							<Checkbox
								edge="start"
								checked={isPurchased}
								tabIndex={-1}
								disableRipple
								inputProps={{ 'aria-labelledby': `checkbox-label-${id}` }}
							/>
						</Tooltip>
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
