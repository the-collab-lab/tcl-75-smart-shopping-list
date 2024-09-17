import React, { useState } from 'react';

import { ListItem } from '../components';
import { AddItems } from '../components/AddItems';
import TextInputElement from '../components/TextInputElement';
import { DocumentData } from 'firebase/firestore';

type ListProps = {
	items: DocumentData[];
	listPath: string | null;
};

export function List({ items, listPath }: ListProps) {
	const [searchItem, setSearchItem] = useState('');

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = items.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);
	console.log(`Current list path: ${listPath}`);
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
