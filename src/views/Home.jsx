import './Home.css';
import { SingleList } from '../components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createList } from '../api';

export function Home({ data, setListPath, userId, userEmail }) {
	const [listName, setListName] = useState('');
	const navigate = useNavigate();

	const handleChange = (event) => {
		setListName(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const currentLists = data.map((list) => {
			return list.name.toLowerCase();
		});

		if (currentLists.includes(listName.toLowerCase())) {
			alert('The list already exists. Please enter a different name.');
			setListName('');
			return;
		}

		try {
			const response = await createList(userId, userEmail, listName);
			// console.log('check response', response);
			setListPath(response);
			setListName('');
			alert('List added');
			navigate('/list');
		} catch (err) {
			console.error(err);
			alert('List not created');
		}
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
