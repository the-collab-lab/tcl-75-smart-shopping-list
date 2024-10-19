import { useEnsureListPath } from '../hooks/useEnsureListPath';
import { Box, Paper } from '@mui/material';
import { AddItems, ShareList } from '../components';
import { darkPaperStyle, lightPaperStyle } from '../App';

export function ManageList({ items }) {
	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;

	return (
		<Paper elevation={2} sx={darkPaperStyle}>
			<Box>
				<Paper elevation={3} sx={lightPaperStyle}>
					<AddItems items={items} />
				</Paper>
				<Paper
					elevation={3}
					sx={{ ...lightPaperStyle, marginBlockStart: '2rem' }}
				>
					<ShareList />
				</Paper>
			</Box>
		</Paper>
	);
}
