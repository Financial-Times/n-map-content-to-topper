module.exports = {
	files: {
		allow: [
			'.husky/pre-commit',
			'.husky/pre-push'
		],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'6da31a37\\x2d691f\\x2d4908\\x2d896f\\x2d2829ebe2309e', // src/lib/get-topper-settings.js:31, test/lib/get-topper-settings.test.js:168|186
			'89d15f70\\x2d640d\\x2d11e4\\x2d9803\\x2d0800200c9a66' // src/lib/get-topper-settings.js:156
		]
	}
};
