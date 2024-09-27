import { ListItem } from '../components';
import { useState } from 'react';
import { AddItems } from '../components/AddItems';
import TextInputElement from '../components/TextInputElement';
import { comparePurchaseUrgency } from '../api';

export function List({ data, listPath }) {
	const [searchItem, setSearchItem] = useState('');

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
	console.log(filteredItems);
	console.log(`filter: ${filteredItems.map((d) => d.name)}`);
	console.log('----');
	const listName = listPath.slice(listPath.indexOf('/') + 1);

	const soon = [];
	const kindOfSoon = [];
	const notSoon = [];
	const inactive = [];

	filteredItems.forEach((item) => {
		if (item.daysUntilNextPurchase <= 7) {
			soon.push(item);
		} else if (
			item.daysUntilNextPurchase > 7 &&
			item.daysUntilNextPurchase < 30
		) {
			kindOfSoon.push(item);
		} else if (item.daysUntilNextPurchase >= 30) {
			notSoon.push(item);
		} else if (item.daysSinceLastPurchase >= 60) {
			inactive.push(item);
		}
	});
	// console.log('soon', soon);
	// console.log('kindOfSoon', kindOfSoon);
	// console.log('notSoon', notSoon);
	// console.log('inactive', inactive);

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
						{/* {filteredItems.map((item) => {
							console.log(
								`${item.name} ${item.dateLastPurchased ? 'purchased' : 'created'} [${item.dateLastPurchased?.toDate().toLocaleString() ?? item.dateCreated.toDate().toLocaleString()}]`,
								item.daysUntilNextPurchase,
							);
							return <ListItem key={item.id} item={item} listPath={listPath} />;
						})} */}
						<h5>Soon</h5>
						{soon.map((item) => {
							return <ListItem key={item.id} item={item} listPath={listPath} />;
						})}
						<h5>Kind of Soon</h5>
						{kindOfSoon.map((item) => {
							return <ListItem key={item.id} item={item} listPath={listPath} />;
						})}
						<h5>Not Soon</h5>
						{notSoon.map((item) => {
							return <ListItem key={item.id} item={item} listPath={listPath} />;
						})}
						<h5>Inactive</h5>
						{inactive.map((item) => {
							return <ListItem key={item.id} item={item} listPath={listPath} />;
						})}
					</ul>
				</>
			)}
		</>
	);
}
