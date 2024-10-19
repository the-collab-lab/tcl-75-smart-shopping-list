const paperStyle = {
	color: 'white',
	p: '1rem',
};

export const darkPaperStyle = {
	...paperStyle,
	paddingBlockStart: '4rem',
	paddingBlockEnd: '4rem',
	background: `linear-gradient(45deg, rgba(117, 124, 232, 0.2) 0%, rgba(117, 124, 232, 0.05) 100%)`, // Pale blue gradient on top
	backdropFilter: 'blur(2px)',
};

export const lightPaperStyle = {
	...paperStyle,
	background: `rgba(117, 124, 232, 0.2)`,
};

export const tooltipStyle = {
	fontSize: '1.5rem',
	marginBlockStart: '0',
	marginBlockEnd: '0',
};

export const buttonStyle = {
	color: 'white',
	fontSize: '1.5rem',
};

export const buttonWithTopMarginStyle = {
	...buttonStyle,
	marginTop: '0.5rem',
};

export const typographyStyle = {
	padding: '1em',
	color: 'white',
};
