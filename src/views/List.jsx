import { ListItem } from '../components';
import { useState } from 'react';
import { useStateWithStorage } from '../utils';
import { AddItems } from '../components/AddItems';
import TextInputElement from '../components/TextInputElement';

export function List({ data }) {
	const [searchItem, setSearchItem] = useState('');
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = data.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

	const listName = listPath.slice(listPath.indexOf('/') + 1);

	return (
		<>
			{!data.length ? (
				<>
					<p>Welcome to {listName}!</p>
					<p>Ready to add your first item? Start adding below!</p>

					<AddItems />
				</>
			) : (
				<>
					<p>{listName}</p>

					<form onSubmit={(event) => event.preventDefault()}>
						<TextInputElement
							id="search-item"
							type="search"
							placeholder="Search Item..."
							onChange={handleTextChange}
						>
							Search Item:
						</TextInputElement>
					</form>
					<ul>
						{filteredItems.map((item) => {
							return <ListItem key={item.id} name={item.name} />;
						})}
					</ul>
				</>
			)}
		</>
	);
}
