import { AddItems } from '../components/AddItems';
import { ShareList } from '../components/ShareList';

export function ManageList({ items }) {
	return (
		<div>
			<AddItems items={items} />
			<ShareList />
		</div>
	);
}
