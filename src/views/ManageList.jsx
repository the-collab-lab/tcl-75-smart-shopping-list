import { useEnsureListPath } from '../hooks/useEnsureListPath';
import Box from '@mui/material/Box';
import { AddItems, ShareList } from '../components';

export function ManageList({ items }) {
	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;
	return (
		<Box>
			<AddItems items={items} />
			<ShareList />
		</Box>
	);
}
