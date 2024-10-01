import './Home.css';
import { SingleList } from '../components';
import { useNavigate } from 'react-router-dom';
import { createList } from '../api';
import TextInputElement from '../components/TextInputElement';
import { useImportance } from '../utils';

export function Home({ data, setListPath, userId, userEmail }) {
	const { sortedLists, setImportantList, isListImportant } =
		useImportance(data);
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const listName = event.target['list-name'].value;
		const currentLists = sortedLists.map((list) => {
			return list.name.toLowerCase();
		});

		try {
			if (currentLists.includes(listName.toLowerCase())) {
				alert('The list already exists. Please enter a different name.');
				return;
			}

			const listPath = await createList(userId, userEmail, listName);
			setListPath(listPath);
			alert('List added');
			navigate('/list');
		} catch (err) {
			console.error(err);
			alert('List not created');
		} finally {
			event.target.reset();
		}
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<form id="list-form" onSubmit={handleSubmit}>
				<TextInputElement
					key="list-name"
					label="Enter New List:"
					type="text"
					id="list-name"
					placeholder="New List Name"
					required={true}
				/>
				<button type="submit">Add List</button>
			</form>

			<ul>
				{sortedLists.map((item, index) => {
					return (
						<SingleList
							key={item.name + index}
							name={item.name}
							path={item.path}
							setListPath={setListPath}
							setImportantList={setImportantList}
							isImportant={isListImportant(item.path)}
						/>
					);
				})}
			</ul>
		</div>
	);
}
