import { describeAveragePurchaseInterval } from '../utils';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Typography,
	IconButton,
	Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const InfoCard = ({ item, toggleCard, show }) => {
	const typographyOptions = {
		totalPurchases: `You've purchased this item ${item.totalPurchases} times`,
		averagePurchaseInterval: describeAveragePurchaseInterval(
			item.averagePurchaseInterval,
		),
		dateCreated: `Item added on: ${item.dateCreated?.toDate().toLocaleString()}`,
		dateLastPurchased: item.dateLastPurchased
			? `Last bought on: ${item.dateLastPurchased?.toDate().toLocaleString()}`
			: 'Not purchased yet',
		dateNextPurchased: `Expected to buy again by: ${item.dateNextPurchased?.toDate().toLocaleString() ?? 'No estimate yet'}`,
	};

	return (
		<Box width="100%">
			<Collapse in={show}>
				<Card variant="outlined">
					<CardHeader
						title={<Box style={{ fontSize: '2rem' }}>{item?.name}</Box>}
						action={
							<IconButton
								aria-label="close"
								onClick={toggleCard}
								sx={(theme) => ({
									position: 'absolute',
									right: 20,
									top: 15,
									color: theme.palette.grey[700],
								})}
							>
								<CloseIcon />
							</IconButton>
						}
					/>
					<CardContent sx={{ color: 'text.secondary' }}>
						{Object.entries(typographyOptions).map(([key, option]) => (
							<Typography
								key={key}
								variant="body2"
								sx={{ color: 'text.secondary' }}
								fontSize="large"
							>
								{option}
							</Typography>
						))}
					</CardContent>
				</Card>
			</Collapse>
		</Box>
	);
};
