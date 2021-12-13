const { expect } = require('chai');
const { getTopperSettings } = require('../../src/lib/get-topper-settings');

describe('Get topper settings', () => {
	it('returns the basic topper when the topper theme is unknown', () => {
		const topper = getTopperSettings({
			topper: { theme: 'unknown-theme' }
		});

		expect(topper).to.deep.include({
			backgroundColour: 'paper',
			modifiers: ['basic'],
			myFtButton: {
				variant: 'standard',
				followPlusDigestEmail: false
			}
		});
	});

	describe('Live blog', () => {
		it('returns the live blog v2 topper', () => {
			const topper = getTopperSettings({
				type: 'live-blog-package'
			});

			expect(topper).to.deep.include({
				largeHeadline: true,
				backgroundColour: 'paper',
				modifiers: ['full-bleed-offset']
			});
		});
	});

	describe('Package articles with an `extra` theme', () => {
		it('returns the slate offset topper', () => {
			const topper = getTopperSettings({
				containedIn: [{ id: 123 }],
				package: {
					design: {
						theme: 'extra'
					}
				}
			});

			expect(topper).to.deep.include({
				largeHeadline: true,
				backgroundColour: 'slate',
				modifiers: ['full-bleed-offset', 'package-extra']
			});
		});
	});

	describe('Package', () => {
		it('returns the correct topper based on the package theme', () => {
			const topper = getTopperSettings({
				type: 'package',
				design: {
					theme: 'extra-wide'
				}
			});

			expect(topper).to.deep.include({
				layout: 'split-text-left',
				largeHeadline: true,
				backgroundColour: 'slate',
				modifiers: [
					'split-text-left',
					'package',
					'package-extra-wide'
				]
			});
		});
	});

	describe('Editorially selected topper', () => {
		it('overrides the `backgroundColour`', () => {
			const topper = getTopperSettings({
				topper: { layout: 'full-bleed-offset' }
			});

			expect(topper).to.deep.include({
				layout: 'full-bleed-offset',
				largeHeadline: true,
				backgroundColour: 'wheat',
				modifiers: ['full-bleed-offset'],
				includesImage: true
			});
		});

		it('sets the `backgroundColour` to `wheat` if undefined', () => {
			const topper = getTopperSettings({
				topper: { layout: 'split-text-center' }
			});

			expect(topper.backgroundColour).to.equal('wheat');
		});
	});

	describe('Podcast', () => {
		it('returns the podcast topper', () => {
			const topper = getTopperSettings({
				subtype: 'podcast',
				byline: 'byline',
				mainImage: {
					url: 'mainImageUrl'
				}
			});

			expect(topper).to.deep.include({
				isPodcast: true,
				fthead: 'mainImageUrl',
				standfirst: 'byline'
			});
		});
	});

	describe('Branded toppers', () => {
		it('returns the standard branded topper with a headshot', () => {
			const topper = getTopperSettings({
				authorConcepts: [
					{
						attributes: [
							{
								key: 'headshot',
								value: 'fthead'
							}
						]
					}
				],
				brandConcept: true
			});

			expect(topper).to.deep.include({
				backgroundColour: 'wheat',
				modifiers: ['branded', 'has-headshot'],
				isOpinion: false,
				fthead: 'fthead',
				myFtButton: {
					variant: 'standard',
					followPlusDigestEmail: false
				}
			});
		});

		describe('Opinion branded topper', () => {
			it('returns the topper for opinion articles not in a package', () => {
				const topper = getTopperSettings({
					genreConcept: {
						id: '6da31a37-691f-4908-896f-2829ebe2309e'
					},
					containedIn: []
				});

				expect(topper).to.deep.include({
					backgroundColour: 'sky',
					isOpinion: true,
					myFtButton: {
						variant: 'opinion',
						followPlusDigestEmail: false
					}
				});
			});

			it('returns the topper for opinion articles in a package', () => {
				const topper = getTopperSettings({
					genreConcept: {
						id: '6da31a37-691f-4908-896f-2829ebe2309e'
					},
					containedIn: [{ id: 123 }]
				});

				expect(topper).to.deep.include({
					backgroundColour: 'wheat',
					isOpinion: true,
					myFtButton: {
						variant: 'standard',
						followPlusDigestEmail: false
					}
				});
			});
		});
	});

	describe('Follow plus digest email', () => {
		it('does not have enhanced behaviour if `onboardingMessaging` flag is not present', (done) => {
			const topper = getTopperSettings({}, {});
			expect(topper.myFtButton.followPlusDigestEmail).to.be.false;
			done();
		});

		it('does not have enhanced behaviour if `onboardingMessaging` parameter is not set', (done) => {
			const topper = getTopperSettings(
				{},
				{ onboardingMessaging: undefined }
			);
			expect(topper.myFtButton.followPlusDigestEmail).to.be.false;
			done();
		});

		it('has enhanced behaviour if `onboardingMessaging` parameter set', () => {
			const topper = getTopperSettings(
				{},
				{ onboardingMessaging: 'followPlusEmailDigestTooltip' }
			);
			expect(topper.myFtButton.followPlusDigestEmail).to.be.true;
		});
	});
});
