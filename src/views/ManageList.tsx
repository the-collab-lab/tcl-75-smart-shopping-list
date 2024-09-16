import { DocumentData } from 'firebase/firestore';
import { AddItems } from '../components/AddItems';
import { ShareList } from '../components/ShareList';

type ManageListProps = {
	items: DocumentData[];
};

export function ManageList({ items }: ManageListProps) {
	return (
		<div>
			<AddItems items={items} />
			<ShareList />
		</div>
	);
}
