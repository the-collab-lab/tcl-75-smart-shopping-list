import { useState } from 'react';
import { updateItem, deleteItem } from '../api';
import { calculateDateNextPurchased, ONE_DAY_IN_MILLISECONDS } from '../utils';
import { toast } from 'react-toastify';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { InfoCard } from './InfoCard';
import { IconWithTooltip, tooltipStyle } from './IconWithTooltip';
import {
	ListItem as MaterialListItem,
	Tooltip,
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
	MoreHoriz,
	DeleteOutlineOutlined,
} from '@mui/icons-material';

import './ListItem.css';

const currentDate = new Date();

const urgencyStatusIcons = {
	overdue: OverdueIcon,
	soon: SoonIcon,
	kindOfSoon: KindOfSoonIcon,
	notSoon: NotSoonIcon,
	inactive: InactiveIcon,
};

const largeWhiteFontStyle = {
	fontSize: '2.5rem',
	color: 'white',
};

const toolTipStyle = {
	fontSize: '1.5rem',
	marginBlockStart: '0',
	marginBlockEnd: '0',
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
	const [showCard, setShowCard] = useState(false);
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

	const toggleMoreInformation = () => {
		setShowCard((prev) => !prev);
	};

	const UrgencyStatusIcon = urgencyStatusIcons[itemUrgencyStatus];

	const urgencyIconProps = {
		icon: <UrgencyStatusIcon sx={largeWhiteFontStyle} fontSize="large" />,
		ariaLabel: { itemUrgencyStatus },
		title: <p style={toolTipStyle}>{itemUrgencyStatus}</p>,
		placement: 'left',
	};

	const deleteIconProps = {
		icon: <DeleteOutlineOutlined sx={{ color: 'white' }} fontSize="large" />,
		onClick: toggleDialog,
		ariaLabel: 'Delete item',
		title: 'Delete',
		placement: 'left',
	};

	const moreInformationProps = {
		icon: <MoreHoriz sx={largeWhiteFontStyle} />,
		onClick: toggleMoreInformation,
		ariaLabel: 'More information',
		title: 'More information',
		placement: 'right',
	};

	const confirmDialogProps = {
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
			{open && <ConfirmDialog props={confirmDialogProps} />}
			<MaterialListItem className="ListItem">
				{showCard ? (
					<InfoCard
						item={item}
						toggleCard={toggleMoreInformation}
						show={showCard}
					/>
				) : (
					<>
						{UrgencyStatusIcon && <IconWithTooltip {...urgencyIconProps} />}

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

						{/* delete icon */}
						<IconWithTooltip {...deleteIconProps} />

						{/* more information icon */}
						<IconWithTooltip {...moreInformationProps} />
					</>
				)}
			</MaterialListItem>
		</>
	);
}
