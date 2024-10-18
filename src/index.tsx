import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

import './index.css';

const rootElement = document.getElementById('root');
try {
	if (rootElement) {
		const root = createRoot(rootElement);
		root.render(
			<StrictMode>
				<App />
			</StrictMode>,
		);
	}
} catch (error) {
	throw new Error(`Could not get root element. Error: ${error}`);
}
