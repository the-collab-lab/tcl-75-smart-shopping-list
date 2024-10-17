import React, { useState } from 'react';
import { useEnsureListPath, useUrgency } from '../hooks';
import { getUrgency } from '../utils/urgencyUtils';
import {
	List as UnorderedList,
	Box,
	Grid,
	Paper,
	Typography,
	Collapse,
	Button,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
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
	const [showAddItems, setShowAddItems] = useState(false);
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

	const handleAddItems = () => {
		setShowAddItems((prev) => !prev);
	};

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
					<Box sx={{ flexGrow: 1, margin: '2.5rem 2rem' }}>
						<Grid
							container
							spacing={4}
							columns={16}
							justifyContent="space-between"
						>
							<Grid item>
								<Typography variant="h3">{listName}</Typography>
							</Grid>
							<Grid item>
								<Button
									variant="outlined"
									onClick={handleAddItems}
									endIcon={showAddItems ? <ArrowDropUp /> : <ArrowDropDown />}
								>
									<Typography variant="h4">New item</Typography>
								</Button>
							</Grid>
						</Grid>
					</Box>

					{showAddItems && (
						<Box>
							<Collapse in={showAddItems}>
								<AddItems items={data} />
							</Collapse>
						</Box>
					)}

					<Box component="form" onSubmit={(event) => event.preventDefault()}>
						<TextInputElement
							id="search-item"
							type="search"
							placeholder="Search item..."
							required={true}
							onChange={handleTextChange}
							label="Search item:"
						/>
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
		</Paper>
	);
});
