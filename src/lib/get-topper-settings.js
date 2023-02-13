const themeImageRatio = {
	'split-text-center': 'split',
	'split-text-left': 'split',
	'full-bleed-image-center': 'full-bleed',
	'full-bleed-image-left': 'full-bleed',
	'full-bleed-offset': 'full-bleed',
	'deep-portrait': 'portrait',
	'deep-landscape': 'landscape'
};

const isLiveBlogV2 = (content) => content.type === 'live-blog-package';

const isPackageArticlesWithExtraTheme = (content) =>
	content.containedIn &&
	content.containedIn.length &&
	content.package &&
	content.package.design.theme.includes('extra');

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

const useLiveBlogV2 = (content) => {
	return {
		largeHeadline: true,
		backgroundColour: 'paper',
		modifiers: ['full-bleed-offset'],
		layout:
			content.topper && content.topper.layout
				? content.topper.layout
				: 'full-bleed-offset'
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
		basic: {
			bgColour: 'wheat',
			layout: 'split-text-left',
			largeHeadline: true
		},
		'special-report': {
			bgColour: 'claret',
			layout: 'split-text-left',
			largeHeadline: true
		},
		extra: {
			bgColour: 'slate',
			layout: 'split-text-left',
			largeHeadline: true
		},
		'extra-wide': {
			bgColour: 'slate',
			layout: 'split-text-left',
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

const useEditoriallySelectedTopper = (content, flags) => {
	let backgroundColour;
	let myFtButtonVariant = 'standard';

	// Convert old palette colours to new palette colours from Methode
	if (content.topper.layout === 'full-bleed-offset') {
		backgroundColour = 'wheat';
	} else if (content.topper.layout === 'deep-landscape') {
		if (content.topper.backgroundColour === 'wheat') {
			backgroundColour = 'white'
		}
		myFtButtonVariant = 'opinion'
	} else if (
		content.topper.backgroundColour === 'pink' ||
		content.topper.backgroundColour === 'auto'
	) {
		backgroundColour = 'wheat';
	} else if (content.topper.backgroundColour === 'blue') {
		backgroundColour = 'oxford';
	} else {
		backgroundColour = content.topper.backgroundColour || 'wheat';
	}

	return {
		layout: content.topper.layout,
		largeHeadline: true,
		backgroundColour,
		modifiers: [content.topper.layout],
		includesImage: true,
		myFtButton: {
			variant: myFtButtonVariant,
			followPlusDigestEmail: followPlusDigestEmail(flags)
		}
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
		standfirst: content.standfirst,
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
	const alphavilleConceptId = '89d15f70-640d-11e4-9803-0800200c9a66';
	let backgroundColour;
	let headshotTint;
	let isOpinion =
		content.genreConcept && content.genreConcept.id === opinionGenreConceptId
			? true
			: false;
	let isAlphaville =
		content.brandConcept && content.brandConcept.id === alphavilleConceptId
			? true
			: false;
	let myFtButtonVariant = 'standard';

	if (isOpinion) {
		backgroundColour =
			content.containedIn && content.containedIn.length ? 'wheat' : 'sky';

		myFtButtonVariant = backgroundColour === 'sky' ? 'opinion' : 'standard';
		modifiers.push('opinion');
		headshotTint = '054593,d6d5d3';
		isOpinion = true;
	} else if (isAlphaville) {
		myFtButtonVariant = 'alphaville';
		backgroundColour = 'matisse';
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
		isAlphaville,
		headshotTint,
		fthead,
		myFtButton: {
			variant: myFtButtonVariant,
			followPlusDigestEmail: followPlusDigestEmail(flags)
		}
	};
};

const getTopperSettings = (content, flags = {}) => {
	content.topper = content.topper || {};

	if (isLiveBlogV2(content)) {
		return useLiveBlogV2(content);
	} else if (isPackageArticlesWithExtraTheme(content)) {
		return useExtraThemeTopper();
	} else if (isPackage(content)) {
		return usePackageTopper(content);
	} else if (isEditoriallySelected(content)) {
		return useEditoriallySelectedTopper(content, flags);
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
