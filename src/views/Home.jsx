import { useNavigate } from 'react-router-dom';
import { createList } from '../api';
import { toast } from 'react-toastify';
import { useImportance } from '../hooks';
import { ButtonGroup, Button } from '@mui/material';
import { SingleList, TextInputElement } from '../components';
import './Home.css';

export const buttonStyle = {
	color: 'white',
	fontSize: '1.5rem',
};

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
				toast.error('The list already exists. Please enter a different name.');
				return;
			}

			const listPath = await createList(userId, userEmail, listName);
			setListPath(listPath);
			toast.success('List added');
			navigate('/list');
		} catch (err) {
			console.error(err);
			toast.error('List not created');
		} finally {
			event.target.reset();
		}
	};

	return (
		<div className="Home">
			<form id="list-form" onSubmit={handleSubmit}>
				<TextInputElement
					key="list-name"
					label="Enter New List:"
					type="text"
					id="list-name"
					placeholder="New List Name"
					required={true}
				/>
				<Button sx={buttonStyle} variant="outlined" type="submit">
					Add List
				</Button>
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
