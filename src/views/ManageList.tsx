import { AddItems } from '../components/AddItems';
import { ShareList } from '../components/ShareList';
import { Item } from '../types/types';

type ManageListProps = {
	items: Item[];
};

export function ManageList({ items }: ManageListProps) {
	return (
		<div>
			<AddItems items={items} />
			<ShareList />
		</div>
	);
}
