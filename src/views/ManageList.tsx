import { DocumentData } from 'firebase/firestore';
import { useEnsureListPath } from '../hooks/useEnsureListPath';
import { AddItems, ShareList } from '../components';

export function ManageList({ items }: { items: DocumentData[] }) {
	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;

	return (
		<div>
			<AddItems items={items} />
			<ShareList />
		</div>
	);
}
