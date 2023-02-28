const {
	themeImageRatio,
	followPlusDigestEmail,
	getTopperSettings
} = require('./lib/get-topper-settings');

const { hasDarkBackground, hasLightBackground } = require('./lib/utils');

const myFtButtonVariant = (backgroundColour, layout) => {
	if (layout === 'deep-landscape' && hasLightBackground(backgroundColour)) {
		return 'inverse-monochrome';
	}
	return !backgroundColour || hasLightBackground(backgroundColour)
		? 'standard'
		: 'monochrome';
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
				content.descriptionHTML || topper.standfirst || content.standfirst,
			myFtButton: {
				variant: myFtButtonVariant(settings.backgroundColour, settings.layout),
				followPlusDigestEmail: followPlusDigestEmail(flags)
			},
			themeImageRatio: themeImageRatio[settings.layout]
		},
		settings,
		{ hasDarkBackground: hasDarkBackground(settings.backgroundColour) }
	);
};
