import './Home.css';
import { SingleList } from '../components';
import { useLocation } from 'react-router-dom';

export function Home({ data, setListPath }) {
	let location = useLocation();
	let path = location.pathname;

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>

			<ul>
				{data.map((item, index) => {
					return (
						<SingleList
							key={item + index}
							name="First List"
							path={path}
							setListPath={setListPath}
						/>
					);
				})}
			</ul>
		</div>
	);
}
