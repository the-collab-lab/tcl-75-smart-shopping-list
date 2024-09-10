import { AddItems } from '../components/AddItems';
import { ShareList } from '../components/ShareList';

export function ManageList({ data }) {
	return (
		<div>
			<AddItems data={data} />
			<ShareList />
		</div>
	);
}
