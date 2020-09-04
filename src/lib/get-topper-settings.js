const themeImageRatio = {
	'split-text-center': 'split',
	'split-text-left': 'split',
	'full-bleed-image-center': 'full-bleed',
	'full-bleed-image-left': 'full-bleed',
	'full-bleed-offset': 'full-bleed'
};

const isNews = (content) =>
	content.annotations &&
	content.annotations.some((annotation) => annotation.prefLabel === 'News');

const isLiveBlogOrPackage = (content) =>
	(content.realtime && content.liveBlog) ||
	(content.package &&
		isNews(content.package) &&
		content.package.contains[0].id === content.id) ||
	(content.type === 'package' && isNews(content));

const isPackageArticlesWithExtraTheme = (content) =>
	content.containedIn &&
	content.containedIn.length &&
	content.package &&
	content.package.design.theme.includes('extra') &&
	!isNews(content.package);

const isPackage = (content) =>
	content.type === 'package' && content.design && content.design.theme;

const isEditoriallySelected = (content) =>
	content.topper &&
	content.topper.layout &&
	themeImageRatio.hasOwnProperty(content.topper.layout);

const isPodcast = (content) => content.subtype === 'podcast';

const isBranded = (content) =>
	content.brandConcept ||
	(content.topper && content.topper.isBranded) ||
	(content.genreConcept &&
		content.genreConcept.id === '6da31a37-691f-4908-896f-2829ebe2309e');

const followPlusDigestEmail = (flags) => {
	return flags.onboardingMessaging === 'followPlusEmailDigestTooltip';
};

const useLiveBlogOrPackageTopper = (content, flags) => {
	const designTheme =
		(content.package && content.package.design.theme) ||
		(content.design && content.design.theme);
	const isStandaloneLiveBlog =
		!content.package && content.realtime && content.liveBlog;

	const isLoud =
		designTheme === 'extra' ||
		designTheme === 'extra-wide' ||
		isStandaloneLiveBlog;

	return {
		layout: null,
		backgroundColour: isLoud ? 'crimson' : 'wheat',
		modifiers: ['news-package'],
		themeImageRatio: 'split',
		includesImage: true,
		isExperimental: true,
		myFtButton: {
			variant: isLoud ? 'monochrome' : 'standard',
			followPlusDigestEmail: followPlusDigestEmail(flags)
		}
	};
};

const useExtraThemeTopper = () => {
	return {
		layout: 'full-bleed-offset',
		largeHeadline: true,
		backgroundColour: 'slate',
		modifiers: ['full-bleed-offset', 'package-extra'],
		includesImage: true
	};
};

const usePackageTopper = (content) => {
	const themeMap = {
		'basic': {
			bgColour: 'wheat',
			layout: 'split-text-left',
			largeHeadline: true
		},
		'special-report': {
			bgColour: 'claret',
			layout: 'split-text-left',
			largeHeadline: true
		},
		'extra': {
			bgColour: 'slate',
			layout: 'split-text-left',
			largeHeadline: true
		},
		'extra-wide': {
			bgColour: 'slate',
			// TODO: Find out if the App uses an `extra-wide` theme
			layout: 'full-bleed-offset',
			largeHeadline: true
		}
	};

	const selectedTheme = themeMap[content.design.theme];
	const modifiers = [
		selectedTheme.layout,
		'package',
		`package-${content.design.theme}`
	];

	return {
		layout: selectedTheme.layout,
		largeHeadline: selectedTheme.largeHeadline,
		backgroundColour: selectedTheme.bgColour,
		modifiers,
		includesImage: true
	};
};

const useEditoriallySelectedTopper = (content) => {
	let backgroundColour;

	// Convert old palette colours to new palette colours from Methode
	if (content.topper.layout === 'full-bleed-offset') {
		backgroundColour = 'paper';
	} else if (
		content.topper.backgroundColour === 'pink' ||
		content.topper.backgroundColour === 'auto'
	) {
		backgroundColour = 'paper';
	} else if (content.topper.backgroundColour === 'blue') {
		backgroundColour = 'oxford';
	} else {
		backgroundColour = content.topper.backgroundColour || 'paper';
	}

	return {
		layout: content.topper.layout,
		largeHeadline: true,
		backgroundColour,
		modifiers: [content.topper.layout],
		includesImage: true
	};
};

const usePodcastTopper = (content, flags) => {
	return {
		layout: 'branded',
		backgroundColour: 'slate',
		isPodcast: true,
		includesImage: true,
		fthead: content.mainImage && content.mainImage.url,
		modifiers: ['branded', 'has-headshot'],
		standfirst: content.byline,
		myFtButton: {
			variant: 'inverse',
			followPlusDigestEmail: followPlusDigestEmail(flags)
		}
	};
};

const useBrandedTopper = (content, flags) => {
	const authorConcepts = content.authorConcepts;
	const headshotConcepts =
		Array.isArray(authorConcepts) &&
		authorConcepts
			.map((concept) => {
				const { attributes = [] } = concept;
				return attributes;
			})
			.flat()
			.filter((attribute) => attribute.key === 'headshot');

	const fthead = headshotConcepts[0] ? headshotConcepts[0].value : '';
	const modifiers = fthead ? ['branded', 'has-headshot'] : ['branded'];
	const opinionGenreConceptId = '6da31a37-691f-4908-896f-2829ebe2309e';

	let backgroundColour;
	let headshotTint;
	let isOpinion = false;

	if (
		content.genreConcept &&
		content.genreConcept.id === opinionGenreConceptId
	) {
		backgroundColour =
			content.containedIn && content.containedIn.length ? 'wheat' : 'sky';
		modifiers.push('opinion');
		headshotTint = '054593,d6d5d3';
		isOpinion = true;
	} else {
		backgroundColour = 'wheat';
	}

	if (content.topper && content.topper.backgroundColour) {
		backgroundColour = content.topper.backgroundColour;
	}

	return {
		layout: 'branded',
		backgroundColour,
		includesTeaser: true,
		modifiers,
		isOpinion,
		headshotTint,
		fthead,
		myFtButton: {
			variant: backgroundColour === 'sky' ? 'opinion' : 'standard',
			followPlusDigestEmail: followPlusDigestEmail(flags)
		}
	};
};

const getTopperSettings = (content, flags = {}) => {
	content.topper = content.topper || {};

	if (isLiveBlogOrPackage(content)) {
		return useLiveBlogOrPackageTopper(content, flags);
	} else if (isPackageArticlesWithExtraTheme(content)) {
		return useExtraThemeTopper();
	} else if (isPackage(content)) {
		return usePackageTopper(content);
	} else if (isEditoriallySelected(content)) {
		return useEditoriallySelectedTopper(content);
	} else if (isPodcast(content)) {
		return usePodcastTopper(content, flags);
	} else if (isBranded(content)) {
		return useBrandedTopper(content, flags);
	} else {
		return {
			layout: null,
			backgroundColour: 'paper',
			includesTeaser: true,
			modifiers: ['basic'],
			myFtButton: {
				variant: 'standard',
				followPlusDigestEmail: followPlusDigestEmail(flags)
			}
		};
	}
};

module.exports = {
	themeImageRatio,
	followPlusDigestEmail,
	getTopperSettings
};
