import { ListItem } from '../components';
import { useEffect, useState } from 'react';
import { AddItems } from '../components/AddItems';
import TextInputElement from '../components/TextInputElement';
import { comparePurchaseUrgency, urgencyObject } from '../api';

export function List({ data, listPath }) {
	const [searchItem, setSearchItem] = useState('');
	const [urgency, setUrgency] = useState(urgencyObject);
	const listName = listPath.slice(listPath.indexOf('/') + 1);

	useEffect(() => {
		setUrgency(urgencyObject);
	}, [urgencyObject]);

	const getClassName = (name) => {
		const statusArray = Object.entries(urgency).find(([_, items]) => {
			return Array.from(items).some((item) => item.name === name);
		});
		if (!statusArray) {
			throw new Error(`Failed to get class name of ${name}`);
		}
		return statusArray[0];
	};

	const handleTextChange = (event) => {
		setSearchItem(event.target.value);
	};
	console.log('----');
	console.log(`before filter: ${data.map((d) => d.name)}`);
	const filteredItems = data
		.filter((item) =>
			item.name.toLowerCase().includes(searchItem.toLowerCase()),
		)
		.sort(comparePurchaseUrgency);

	console.log(`filter: ${filteredItems.map((d) => d.name)}`);
	console.log('----');
	console.log(`Urgency state object:`);
	console.log(urgency);

	return (
		<>
			{!data?.length ? (
				<>
					<p>Welcome to {listName}!</p>
					<p>Ready to add your first item? Start adding below!</p>

					<AddItems items={data} />
				</>
			) : (
				<>
					<p>{listName}</p>

					<form onSubmit={(event) => event.preventDefault()}>
						<TextInputElement
							id="search-item"
							type="search"
							placeholder="Search Item..."
							required={true}
							onChange={handleTextChange}
							label="Search Item:"
						/>
					</form>
					<ul>
						{filteredItems.map((item) => {
							const itemClassName = getClassName(item.name);
							console.log(
								`${item.name}: class [${itemClassName}], ${item.dateLastPurchased ? 'purchased' : 'created'} [${item.dateLastPurchased?.toDate().toLocaleString() ?? item.dateCreated.toDate().toLocaleString()}]`,
							);
							return (
								<ListItem
									key={item.id}
									item={item}
									listPath={listPath}
									className={itemClassName}
								/>
							);
						})}
					</ul>
				</>
			)}
		</>
	);
}
