process.env.NODE_ENV = 'normal';

var { src, dest, series } = require('gulp'),
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	del = require('del'),
	tinypng = require('./index'),
	sigs = process.env.TINYPNG_SIGS ? true : false;

// paths
const srcFolder = './src';
const buildFolder = './build';

const paths = {
	buildImgFolder: `${buildFolder}/min`,
	buildWebpFolder: `${buildFolder}/webp`,
};

const clean = () => {
	return del([buildFolder]);
};

const imagesSvg = () => {
	return src([`${srcFolder}/**/**.svg`])
		.pipe(
			imagemin([
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest(paths.buildImgFolder));
};

const tiny = () => {
	return src([`${srcFolder}/**/**{jpg,jpeg,png}`])
		.pipe(
			tinypng({
				key: process.env.TINYPNG_KEY || 'GGyHoR4JUDoyvdV0cNSc2dvgNdquEimE',
				log: true,
				sigFile: sigs ? '.sigs' : false,
			}).on('error', function (err) {
				console.error(err.message);
			})
		)
		.pipe(dest(paths.buildImgFolder));
};

const webpImages = () => {
	return src([`${srcFolder}/**/**.{jpg,jpeg,png}`])
		.pipe(webp({ quality: 50 }))
		.pipe(dest(paths.buildWebpFolder));
};

process.env.NODE_ENV = 'test';

exports.build = series(clean, tiny, imagesSvg, webpImages);
