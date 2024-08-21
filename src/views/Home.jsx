import './Home.css';
import { SingleList } from '../components';
import { useState } from 'react';

export function Home({ data, setListPath }) {
	const [listName, setListName] = useState('');

	const handleChange = (event) => {
		setListName(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<form id="list-form" onSubmit={handleSubmit}>
				<label htmlFor="list-name">Enter New List:</label>
				<input
					id="list-name"
					type="text"
					value={listName}
					placeholder="New List Name"
					onChange={handleChange}
					required
				></input>
				<button type="submit">Add List</button>
			</form>
			<ul>
				{data.map((item, index) => {
					return (
						<SingleList
							key={item.name + index}
							name={item.name}
							path={item.path}
							setListPath={setListPath}
						/>
					);
				})}
			</ul>
		</div>
	);
}
