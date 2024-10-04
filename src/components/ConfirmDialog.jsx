import './ConfirmDialog.css';
import React from 'react';
import {
	MaterialButton,
	buttonStyle,
	whiteFontColor,
} from './material-buttons';
import {
	Typography,
	IconButton,
	Slide,
	Dialog,
	DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// MUI's Dialog already comes with built-in focus management and accessibility features.
// It automatically traps focus inside the modal, moves focus to the modal when it opens,
// and returns it to the previously focused element when it closes.

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

const dialogStyle = {
	backgroundColor: 'rgb(20, 20, 20, 0.8)',
	position: 'absolute',
	top: 20,
	right: 20,
};

const typographyStyle = {
	padding: '1em',
	...whiteFontColor,
};

export function ConfirmDialog({ props }) {
	const { handleDelete, title, setOpen, open } = props;

	const handleClose = (event) => {
		setOpen(false);
		event.target.type === 'submit' && handleDelete();
	};

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			onClose={handleClose}
			PaperProps={{
				style: dialogStyle,
			}}
			BackdropProps={{
				invisible: true,
			}}
			sx={{
				'& .MuiDialog-container': {
					justifyContent: 'flex-end',
					alignItems: 'flex-start',
				},
			}}
		>
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
				<MaterialButton
					type="button"
					color="error"
					sx={buttonStyle}
					onClick={handleClose}
					buttonText="Cancel"
				/>

				<MaterialButton
					type="submit"
					color="success"
					sx={buttonStyle}
					onClick={handleClose}
					buttonText="Confirm"
				/>
			</div>
		</Dialog>
	);
}
