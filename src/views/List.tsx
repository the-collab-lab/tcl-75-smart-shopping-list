import React, { useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ListItem, AddItems, TextInputElement } from '../components';

export function List({
	items,
	listPath,
}: {
	items: DocumentData[];
	listPath: string;
}) {
	const [searchItem, setSearchItem] = useState('');
	const navigate = useNavigate();

	const navigateHome = () => {
		alert('List path is not found');
		navigate('/home');
		return;
	};

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
					{!listPath ? (
						navigateHome()
					) : (
						<ul>
							{filteredItems.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
						</ul>
					)}
				</>
			)}
		</>
	);
}
