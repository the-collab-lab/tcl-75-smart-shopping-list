import { AddItems } from '../components/AddItems';
import { ShareList } from '../components/ShareList';
import { useEnsureListPath } from '../hooks/useEnsureListPath';

export function ManageList({ items }) {
	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;
	return (
		<div>
			<AddItems items={items} />
			<ShareList />
		</div>
	);
}
