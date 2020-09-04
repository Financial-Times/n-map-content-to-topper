const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const sandbox = sinon.createSandbox();
const stubs = {
	topperSettings: {
		followPlusDigestEmail: sandbox.stub(),
		getTopperSettings: sandbox.stub()
	}
};
const mapContentToTopper = proxyquire('../src/map-content-to-topper', {
	'./lib/get-topper-settings': stubs.topperSettings
});

describe('Map content to topper', () => {
	beforeEach(() => {
		stubs.topperSettings.followPlusDigestEmail.returns(false);
	});

	afterEach(() => {
		sandbox.reset();
	});

	describe('Light topper background colour', () => {
		beforeEach(() => {
			stubs.topperSettings.getTopperSettings.returns({
				layout: 'full-bleed-offset',
				backgroundColour: 'paper'
			});
		});

		it('returns the standard myFT button variant', () => {
			const topper = mapContentToTopper({
				title: 'Title',
				standfirst: 'Standfirst'
			});

			expect(topper.myFtButton.variant).to.equal('standard');
			expect(topper.hasDarkBackground).to.equal(false);
		});
	});

	describe('Dark topper background colour', () => {
		beforeEach(() => {
			stubs.topperSettings.getTopperSettings.returns({
				layout: 'full-bleed-offset',
				backgroundColour: 'crimson'
			});
		});

		it('returns the monochrome myFT button variant', () => {
			const topper = mapContentToTopper({
				title: 'Title',
				standfirst: 'Standfirst'
			});

			expect(topper.myFtButton.variant).to.equal('monochrome');
			expect(topper.hasDarkBackground).to.equal(true);
		});
	});
});
