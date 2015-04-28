'use strict';

var fs = require('fs'),
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	runSequence = require('run-sequence'),
	photoEditor = require('../../lib/photoEditor.js');

var watchTimer = false;

var processImages = function processImages() {
	var path = './in/';
	var dir = fs.readdirSync(path);
	var numFiles = 0;
	var fileArr = [];

	for(var f in dir) {
		var fileSync = path + dir[f];
		var stat = fs.statSync(fileSync);

		if(dir[f].toLowerCase().match(/(.jpg)$/)) {
			numFiles++;
			if(stat.isFile()) {
				fileArr.push(dir[f]);
			}
		}
	}

	if(numFiles > 0) {
		console.log('PROCESS!!!');
		clearTimeout(watchTimer);
		photoEditor.edit(fileArr, './in/', './out/');
	}
};

gulp.task('watch', function() {
	watch(['./in/**/*.JPG', './in/**/*.jpg'], function() {
		clearTimeout(watchTimer);
		watchTimer = setTimeout(processImages, 5000);
	});

	watch(['./out/**/*.gif'], function() {
		runSequence('uploadToS3', 'updateJSON', 'uploadJSONToS3', 'clean-out');
	});
});