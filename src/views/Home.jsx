import './Home.css';
import { useNavigate } from 'react-router-dom';
import { createList } from '../api';
import { useImportance } from '../utils';
import { SingleList, TextInputElement } from '../components';
import { MaterialButton } from '../components/material-buttons';
import ButtonGroup from '@mui/material/ButtonGroup';

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
				<MaterialButton type="submit" buttonText="Add List" />
			</form>

			<ul>
				<ButtonGroup size="large" orientation="vertical">
					{sortedLists.map((item, index) => {
						return (
							<SingleList
								key={item.name + index}
								item={item}
								setListPath={setListPath}
								setImportantList={setImportantList}
								isImportant={isListImportant(item.path)}
							/>
						);
					})}
				</ButtonGroup>
			</ul>
		</div>
	);
}
