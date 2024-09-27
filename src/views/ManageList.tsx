import { DocumentData } from 'firebase/firestore';
import { AddItems, ShareList } from '../components';

export function ManageList({ items }: { items: DocumentData[] }) {
	return (
		<div>
			<AddItems items={items} />
			<ShareList />
		</div>
	);
}
