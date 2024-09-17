import './Home.css';
import { Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import { createList } from '../api';
import { SingleList } from '../components';
import TextInputElement from '../components/TextInputElement';

type Props = {
	data: DocumentData[];
	setListPath: Dispatch<string | null>;
	userId: string;
	userEmail: string;
};

export function Home({ data, setListPath, userId, userEmail }: Props) {
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const listName = (form.elements.namedItem('list-name') as HTMLInputElement)
			.value;
		const currentLists = data.map((list) => {
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
			form.reset();
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
