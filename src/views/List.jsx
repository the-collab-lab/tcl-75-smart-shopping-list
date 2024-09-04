import { ListItem } from '../components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function List({ data }) {
	const [searchItem, setSearchItem] = useState('');
	const navigate = useNavigate();

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};

	const filteredItems = data.filter((item) =>
		item.name.toLowerCase().includes(searchItem.toLowerCase()),
	);

	return (
		<>
			{data.length === 0 ? (
				<>
					{/* TODO Add a list name to make it more clear which list we are on */}
					<p>
						Hey! Ready to add your first item? Click button below to start your
						list!
					</p>
					<button onClick={() => navigate('/manage-list')}>Add item!</button>
				</>
			) : (
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
							return <ListItem key={item.id} name={item.name} />;
						})}
					</ul>
				</>
			)}
		</>
	);
}
