import Button from '@mui/material/Button';

export const MaterialButton = ({ buttonText, onClick }) => {
	return <Button onClick={onClick}>{buttonText}</Button>;
};
