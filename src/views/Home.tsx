import './Home.css';
import { Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import { createList } from '../api';
import { SingleList, TextInputElement } from '../components';

export function Home({
	data,
	setListPath,
	userId,
	userEmail,
}: {
	data: DocumentData[];
	setListPath: Dispatch<string>;
	userId?: string | null;
	userEmail?: string | null;
}) {
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!userId || !userEmail) return;

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
			alert('List not created');
			throw new Error(`${err instanceof Error ? err.message : err}`);
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
