import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	IconButton,
	Grow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const InfoCard = ({ item, toggleCard, show }) => {
	const typographyOptions = {
		totalPurchases: `Total purchases: ${item.totalPurchases}`,
		dateCreated: `Date created: ${item.dateCreated?.toDate().toLocaleString()}`,
		dateLastPurchased: `Date last purchased: ${item.dateLastPurchased?.toDate().toLocaleString() ?? 'none yet'}`,
		dateNextPurchased: `Date next purchased: ${item.dateNextPurchased?.toDate().toLocaleString() ?? 'none yet'}`,
	};

	return (
		<Grow in={show} direction="down">
			<Card
				variant="outlined"
				sx={{
					width: '100%',
					maxWidth: '600px',
					minHeight: '200px',
					position: 'relative',
				}}
			>
				<CardHeader title={item?.name} />
				<IconButton
					aria-label="close"
					onClick={toggleCard}
					sx={(theme) => ({
						position: 'absolute',
						right: 10,
						top: 10,
						color: theme.palette.grey[700],
					})}
				>
					<CloseIcon />
				</IconButton>
				<CardContent>
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
		</Grow>
	);
};
