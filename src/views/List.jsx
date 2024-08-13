import { ListItem } from '../components';

export function List({ data }) {
	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<ul>
				{Object.values(data).map((item, index) => (
					<ListItem key={item + index} name={item.name} />
				))}
			</ul>
		</>
	);
}
