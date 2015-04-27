'use strict';

var fs = require('fs'),
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	runSequence = require('run-sequence'),
	photoEditor = require('../../lib/photoEditor.js');
	//runSequence = require('run-sequence');

gulp.task('watch', function() {
	watch(['./in/**/*.jpg'], function() {
		var path = './in/';
		var dir = fs.readdirSync(path);
		var filesNeeded = 5;
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

		if(numFiles == filesNeeded) {
			console.log('PROCESS!!!');
			photoEditor.edit(fileArr, './in/', './out/');
		}
	});

	watch(['./out/**/*.*'], function() {
		runSequence('uploadToS3', 'updateJSON', 'uploadJSONToS3', 'clean-out');
	});
});