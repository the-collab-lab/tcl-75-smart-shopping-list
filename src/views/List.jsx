import { ListItem } from '../components';
import { useState } from 'react';

export function List({ data }) {
	const [searchItem, setSearchItem] = useState('');

	const handleChange = (event) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = data.filter((item) => {
		return item.name.toLowerCase().includes(searchItem.toLowerCase());
	});

	return (
		<>
			<form onSubmit={(event) => event.preventDefault()}>
				<label htmlFor="search-item">Search Item:</label>
				<input
					id="search=item"
					type="text"
					placeholder="Search Item..."
					onChange={handleChange}
					value={searchItem}
				/>

				{searchItem && (
					<button
						type="button"
						onClick={() => {
							setSearchItem('');
						}}
					>
						x
					</button>
				)}
			</form>
			<ul>
				{filteredItems.map((item) => {
					return <ListItem key={item.id} name={item.name} />;
				})}
			</ul>

			{data.length && !filteredItems.length && <p>No results</p>}
		</>
	);
}
