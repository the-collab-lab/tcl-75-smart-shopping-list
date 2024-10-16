import { useState } from 'react';
import { useEnsureListPath } from '../hooks/useEnsureListPath';
import { List as UnorderedList, Box, Grid } from '@mui/material';
import { TextInputElement, AddItems, ListItem } from '../components';

export function List({ data, listPath }) {
	const [searchItem, setSearchItem] = useState('');

	// Redirect to home if no list path is null
	if (useEnsureListPath()) return <></>;

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = data.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

	const listName = listPath.slice(listPath.indexOf('/') + 1);

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
							return <ListItem key={item.id} item={item} listPath={listPath} />;
						})}
					</UnorderedList>
				</>
			)}
		</>
	);
}
