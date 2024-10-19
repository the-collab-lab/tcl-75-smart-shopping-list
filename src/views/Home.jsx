import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { createList } from '../api';
import { toast } from 'react-toastify';
import { useImportance } from '../hooks';
import {
	Paper,
	Box,
	Divider,
	Button,
	List as UnorderedList,
} from '@mui/material';
import {
	SingleList,
	TextInputElement,
	lightPaperStyle,
	darkPaperStyle,
} from '../components';
import './Home.css';

const dividerStyle = {
	borderColor: 'primary.main',
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
		<Paper elevation={2} sx={darkPaperStyle}>
			<div className="Home">
				<Paper elevation={3} sx={lightPaperStyle}>
					<Box component="form" id="list-form" onSubmit={handleSubmit}>
						<TextInputElement
							key="list-name"
							label="Start your new list here:"
							type="text"
							id="list-name"
							placeholder="What's the name of your list?"
							required={true}
						/>
						<Button
							sx={buttonWithTopMarginStyle}
							variant="outlined"
							type="submit"
						>
							Add List
						</Button>
					</Box>
				</Paper>

				<UnorderedList>
					{sortedLists.map((item, index) => {
						return (
							<Fragment key={item.name + index}>
								<SingleList
									item={item}
									setListPath={setListPath}
									setImportantList={setImportantList}
									isImportant={isListImportant(item.path)}
								/>
								<Divider variant="inset" sx={dividerStyle} component="li" />
							</Fragment>
						);
					})}
				</UnorderedList>
			</div>
		</Paper>
	);
}
