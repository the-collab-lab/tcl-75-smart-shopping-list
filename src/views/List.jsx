import { useState } from 'react';
import { useEnsureListPath } from '../hooks/useEnsureListPath';
import { List as UnorderedList } from '@mui/material';
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
