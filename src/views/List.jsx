import { ListItem } from '../components';
import { useState } from 'react';

export function List({ data, listPath }) {
	const [searchItem, setSearchItem] = useState('');

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = data.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

	return (
		<>
			<form onSubmit={(event) => event.preventDefault()}>
				<label htmlFor="search-item">Search Item: </label>

				<input
					id="search-item"
					type="search"
					placeholder="Search Item..."
					onChange={handleTextChange}
					value={searchItem}
				/>

				{searchItem && (
					<button
						type="button"
						onClick={() => {
							setSearchItem('');
						}}
					>
						X
					</button>
				)}
			</form>
			<ul>
				{filteredItems.map((item) => {
					return (
						<ListItem
							key={item.id}
							name={item.name}
							itemId={item.id}
							listPath={listPath}
							purchaseDate={item.dateLastPurchased}
						/>
					);
				})}
			</ul>
		</>
	);
}
