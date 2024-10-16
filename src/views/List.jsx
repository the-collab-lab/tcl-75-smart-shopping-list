import React, { useState } from 'react';
import { useEnsureListPath, useUrgency } from '../hooks';
import { getUrgency } from '../utils/urgencyUtils';
import { List as UnorderedList, Paper, Typography } from '@mui/material';
import { ListItem, AddItems, TextInputElement } from '../components';

const paperStyle = {
	bgcolor: 'var(--color-gray-dark)',
	color: 'white',
	p: '1rem',
};

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
		item?.name?.toLowerCase().includes(searchItem.toLowerCase()),
	);

	return (
		<Paper elevation={2} sx={paperStyle}>
			{!data?.length ? (
				<>
					<Typography variant="h3" my="2rem">
						Welcome to {listName}!
					</Typography>
					<Typography variant="h4" my="3rem">
						Ready to add your first item? Start adding below!
					</Typography>

					<AddItems items={data} />
				</>
			) : (
				<>
					<Typography variant="h3" my="2rem">
						{listName}
					</Typography>

					<form onSubmit={(event) => event.preventDefault()}>
						<TextInputElement
							id="search-item"
							type="search"
							placeholder="Search item..."
							required={true}
							onChange={handleTextChange}
							label="Search item:"
						/>
					</form>
					<UnorderedList>
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
					</UnorderedList>
				</>
			)}
		</Paper>
	);
});
