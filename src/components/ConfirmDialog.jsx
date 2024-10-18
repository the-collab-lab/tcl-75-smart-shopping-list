import React from 'react';
import {
	Typography,
	IconButton,
	Slide,
	Dialog,
	DialogTitle,
	Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { buttonStyle } from '../App';
import './ConfirmDialog.css';

// MUI's Dialog already comes with built-in focus management and accessibility features.
// It automatically traps focus inside the modal, moves focus to the modal when it opens,
// and returns it to the previously focused element when it closes.

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

const dialogStyle = {
	backgroundColor: 'rgb(20, 20, 20)',
};

const typographyStyle = {
	padding: '1em',
	color: 'white',
};

export function ConfirmDialog({ props }) {
	const { handleDelete, title, setOpen, open } = props;

	const handleClose = (event) => {
		setOpen(false);
		event.target.type === 'submit' && handleDelete();
	};

	const dialogProps = {
		open: open,
		TransitionComponent: Transition,
		onClose: handleClose,
		PaperProps: {
			style: dialogStyle,
		},
		BackdropProps: {
			invisible: true,
		},
		sx: {
			'& .MuiDialog-container': {
				justifyContent: 'flex-center',
				alignItems: 'flex-start',
			},
		},
	};

	return (
		<Dialog {...dialogProps}>
			<DialogTitle
				sx={(theme) => ({
					color: theme.palette.grey[400],
				})}
				fontSize="medium"
			>
				Confirm action
			</DialogTitle>

			<IconButton
				aria-label="close"
				onClick={handleClose}
				sx={(theme) => ({
					position: 'absolute',
					right: 8,
					top: 8,
					color: theme.palette.grey[300],
				})}
			>
				<CloseIcon />
			</IconButton>

			<Typography
				sx={typographyStyle}
				fontSize="large"
				variant="h5"
				gutterBottom
			>
				{title}
			</Typography>

			<div className="ConfirmDialog-ButtonGroup">
				<Button
					type="button"
					color="error"
					variant="outlined"
					sx={buttonStyle}
					onClick={handleClose}
				>
					Cancel
				</Button>

				<Button
					type="submit"
					color="success"
					variant="outlined"
					fontSize="large"
					sx={buttonStyle}
					onClick={handleClose}
				>
					Confirm
				</Button>
			</div>
		</Dialog>
	);
}
