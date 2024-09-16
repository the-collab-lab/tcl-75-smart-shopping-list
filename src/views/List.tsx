import React, { useState } from 'react';

import { ListItem } from '../components';
import { useStateWithStorage } from '../utils';
import { AddItems } from '../components/AddItems';
import TextInputElement from '../components/TextInputElement';
import { DocumentData } from 'firebase/firestore';

type ListProps = {
	items: DocumentData[];
};

export function List({ items }: ListProps) {
	const [searchItem, setSearchItem] = useState('');
	const [listPath] = useStateWithStorage('tcl-shopping-list-path', null);

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = items.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

	const listName = listPath?.slice(listPath.indexOf('/') + 1);

	return (
		<>
			{!items.length ? (
				<>
					<p>Welcome to {listName}!</p>
					<p>Ready to add your first item? Start adding below!</p>

					<AddItems items={items} />
				</>
			) : (
				<>
					<p>{listName}</p>

					<form onSubmit={(event) => event.preventDefault()}>
						<TextInputElement
							id="search-item"
							type="search"
							placeholder="Search Item..."
							required={true}
							onChange={handleTextChange}
							label="Search Item:"
						/>
					</form>
					<ul>
						{filteredItems.map((item) => {
							return <ListItem key={item.id} item={item} listPath={listPath} />;
						})}
					</ul>
				</>
			)}
		</>
	);
}
