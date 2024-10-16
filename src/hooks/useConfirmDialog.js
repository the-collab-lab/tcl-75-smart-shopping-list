import { useState } from 'react';

export const useConfirmDialog = () => {
	const [open, isOpen] = useState(false);

	const toggleDialog = () => {
		isOpen((prev) => !prev);
	};

	return { open, isOpen, toggleDialog };
};
