module.exports = {
	files: {
		allow: [],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'isLiveBlogV1OrPackage', // src/lib/get-topper-settings.js:18|234
			'6da31a37-691f-4908-896f-2829ebe2309e' // src/lib/get-topper-settings.js:46, test/lib/get-topper-settings.test.js:291|309
		]
	}
};
