export const hasDarkBackground = (backgroundColour) => {
	const darkBackgrounds = ['black', 'slate', 'oxford', 'claret', 'crimson'];
	return darkBackgrounds.indexOf(backgroundColour) > -1;
};

export const hasLightBackground = (backgroundColour) => {
	const lightBackgrounds = ['paper', 'wheat', 'white'];
	return lightBackgrounds.indexOf(backgroundColour) > -1;
}