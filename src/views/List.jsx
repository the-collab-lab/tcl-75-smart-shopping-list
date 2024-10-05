import React, { useState } from 'react';
import { ListItem, AddItems, TextInputElement } from '../components';
import { useEnsureListPath, useUrgency } from '../hooks';
import { getUrgency } from '../utils/urgencyUtils';

// React.memo is needed to prevent unnecessary re-renders of the List component
// when the props (data and listPath) haven't changed,
// optimizing performance by avoiding re-computation of expensive
// operations like filtering and sorting items.

export const List = React.memo(function List({ data, listPath }) {
	const [searchItem, setSearchItem] = useState('');
	const { urgencyObject } = useUrgency(data);

	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;

	const listName = listPath.slice(listPath.indexOf('/') + 1);

	const sortedItems = Object.values(urgencyObject).flat();

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = sortedItems.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

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
							const itemUrgencyStatus = getUrgency(item.name, urgencyObject);
							return (
								<ListItem
									key={item.id}
									item={item}
									listPath={listPath}
									itemUrgencyStatus={itemUrgencyStatus}
								/>
							);
						})}
					</ul>
				</>
			)}
		</>
	);
});
