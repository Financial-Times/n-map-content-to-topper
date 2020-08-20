const {
	themeImageRatio,
	followPlusDigestEmail,
	getTopperSettings
} = require('./lib/get-topper-settings');

const myFtButtonVariant = (backgroundColour) => {
	const lightBackgrounds = ['paper', 'wheat', 'white'];
	const hasLightBackground = lightBackgrounds.indexOf(backgroundColour) > -1;
	return !backgroundColour || hasLightBackground ? 'standard' : 'monochrome';
};

const hasDarkBackground = (backgroundColour) => {
	const darkBackgrounds = ['black', 'slate', 'oxford', 'claret', 'crimson'];
	return darkBackgrounds.indexOf(backgroundColour) > -1;
};

module.exports = (content, flags = {}) => {
	const topper = content.topper || {};
	const settings = getTopperSettings(content, flags);

	return Object.assign(
		{},
		topper,
		{
			headline: topper.headline || content.title,
			standfirst:
				content.descriptionHTML ||
				topper.standfirst ||
				content.standfirst,
			myFtButton: {
				variant: myFtButtonVariant(settings.backgroundColour),
				followPlusDigestEmail: followPlusDigestEmail(flags)
			},
			themeImageRatio: themeImageRatio[settings.layout]
		},
		settings,
		{ hasDarkBackground: hasDarkBackground(settings.backgroundColour) }
	);
};
