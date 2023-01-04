# n-map-content-to-topper

[![CircleCI](https://circleci.com/gh/Financial-Times/n-map-content-to-topper.svg?style=svg&circle-token=934a725e2f363da1ac042947bb785c4d45795339)](https://circleci.com/gh/Financial-Times/n-map-content-to-topper)

A library for mapping content to a topper on FT.com and the App.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Development](#development)
- [Usage](#usage)
- [Release Process](#release-process)

## Requirements

- Node >12.x
- [Vault](https://github.com/Financial-Times/vault/wiki/Getting-Started-With-Vault)

## Installation

```sh
git clone https://github.com/Financial-Times/n-map-content-to-topper.git
cd n-map-content-to-topper
npm install
```

## Development

### Testing

In order to run the tests locally you'll need to run:

```sh
npm run test
```

### Install from NPM

```sh
npm install @financial-times/n-map-content-to-topper
```

## Usage

```js
const {
	mapContentToTopper
} = require('@financial-times/n-map-content-to-topper');

const topper = mapContentToTopper(content, flags);
```

## Release Process

The project is released automatically to npm via Github [Releases](https://www.github.com/financial-times/{repo}/releases). Create a release, and name the tag with the [Semantic Versioning](https://semver.org/) version you want. The CircleCI build for the tag will release that version to npm.
test
