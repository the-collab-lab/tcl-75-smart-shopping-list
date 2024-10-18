import React, { useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import { useEnsureListPath, useUrgency } from '../hooks';
import { getUrgency } from '../utils/urgencyUtils';
import { List as UnorderedList, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ListItem, AddItems, TextInputElement } from '../components';

export const List = React.memo(function List({
	items,
	listPath,
}: {
	items: DocumentData[];
	listPath: string;
}) {
	const { urgencyObject } = useUrgency(items);
	const [searchItem, setSearchItem] = useState('');

	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;

	const listName = listPath?.slice(listPath.indexOf('/') + 1);

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = items.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

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

					<Box sx={{ flexGrow: 1 }}>
						<Grid
							container
							spacing={8}
							columns={16}
							justifyContent="space-between"
						>
							<Grid size={{ xs: 2, sm: 4, md: 4 }}>
								<AddItems items={items} />
							</Grid>
							<Grid size={{ xs: 2, sm: 4, md: 4 }}>
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
