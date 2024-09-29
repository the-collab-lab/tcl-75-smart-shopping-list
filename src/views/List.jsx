import { ListItem } from '../components';
import React, { useState } from 'react';
import { AddItems } from '../components/AddItems';
import TextInputElement from '../components/TextInputElement';
import { useUrgency } from '../utils';

export const List = React.memo(function List({ data, listPath }) {
	const [searchItem, setSearchItem] = useState('');
	const { getUrgency, urgencyObject } = useUrgency(data);
	const listName = listPath.slice(listPath.indexOf('/') + 1);

	const sortedItems = Object.values(urgencyObject).flat();

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};
	console.log(sortedItems, 'sorted items');
	console.log('----');
	console.log(`before filter: ${data.map((d) => d.name)}`);
	const filteredItems = sortedItems.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

	console.log(`filter: ${filteredItems.map((d) => d.name)}`);
	console.log('----');

	return (
		<>
			{!data?.length ? (
				<>
					<p>Welcome to {listName}!</p>
					<p>Ready to add your first item? Start adding below!</p>

					<AddItems items={data} />
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
							const itemClassName = getUrgency(item.name);
							console.log(
								`${item.name}: class [${itemClassName}], next purchase [${item.dateNextPurchased.toDate().toLocaleString()}]`,
							);
							return (
								<ListItem
									key={item.id}
									item={item}
									listPath={listPath}
									className={itemClassName}
								/>
							);
						})}
					</ul>
				</>
			)}
		</>
	);
});
