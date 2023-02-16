const hasDarkBackground = (backgroundColour) => {
	const darkBackgrounds = ['black', 'slate', 'oxford', 'claret', 'crimson'];
	return darkBackgrounds.includes(backgroundColour);
};

const hasLightBackground = (backgroundColour) => {
	const lightBackgrounds = ['paper', 'wheat', 'white'];
	return lightBackgrounds.includes(backgroundColour);
};

module.exports = {
	hasDarkBackground,
	hasLightBackground
}