import React, { useState } from 'react';
import { useEnsureListPath, useUrgency } from '../hooks';
import { getUrgency } from '../utils/urgencyUtils';
import { List as UnorderedList, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ListItem, AddItems, TextInputElement } from '../components';

// React.memo is needed to prevent unnecessary re-renders of the List component
// when the props (data and listPath) haven't changed,
// optimizing performance by avoiding re-computation of expensive
// operations like filtering and sorting items.

export const List = React.memo(function List({ data, listPath }) {
	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;
	const { urgencyObject } = useUrgency(data);
	const [searchItem, setSearchItem] = useState('');

	const listName = listPath.slice(listPath.indexOf('/') + 1);

	const sortedItems = Object.values(urgencyObject).flat();

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = sortedItems.filter((item) =>
		item?.name?.toLowerCase().includes(searchItem.toLowerCase()),
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
					<Box sx={{ flexGrow: 1 }}>
						<Grid
							container
							spacing={8}
							columns={16}
							justifyContent="space-between"
						>
							<Grid item size={{ xs: 2, sm: 4, md: 4 }}>
								<AddItems items={data} />
							</Grid>
							<Grid item size={{ xs: 2, sm: 4, md: 4 }}>
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
							</Grid>
						</Grid>
					</Box>

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
		</>
	);
});
