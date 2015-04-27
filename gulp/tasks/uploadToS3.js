'use strict';

var fs = require('fs'),
	gulp = require('gulp'),
	secrets = require('./../../secrets'),
	s3 = require('gulp-s3'),
	path = require('path'),
	tap = require('gulp-tap'),
	clean = require('gulp-clean');


gulp.task('clean-out', function(){
	gulp.src(['./out/*.*'])
  	.pipe(gulp.dest('./backup'));

  return gulp.src(['./out/*.*'])
  	.pipe(clean());
});

gulp.task('uploadToS3', function() {
	var options = { headers: {'Cache-Control': 'max-age=315360000, no-transform, public'} }

	if(!secrets) {
		console.log('You need to make a secrets file in the root directory with your AWS info!  Check the README.');
	}

	return gulp.src("./out/**")
        .pipe(s3({
		  "key": secrets.accessKeyId,
		  "secret": secrets.secretAccessKey,
		  "bucket": "shoptology-photo-booth"
		}, options))

});

gulp.task('updateJSON', function() {

	return gulp.src("./out/**")
		.pipe(tap(function (file,t) {
            //console.log(path.basename(file.path));
            var photos = JSON.parse(fs.readFileSync('./web/public/photos.json'));
            // Make sure we dont add the folder
            if(path.basename(file.path) !== 'out') {
            	// remove the extension
            	var filename = path.basename(file.path).split('.')[0];
            	photos.photos.push(filename);
            	console.log('added', filename);

            	// Save file
            	fs.writeFile("./web/public/photos.json", JSON.stringify(photos), function(err) {
				    if(err) {
				        return console.log(err);
				    }
				}); 
            }
        }));
});

gulp.task('uploadJSONToS3', function() {
	var options = { headers: {'Cache-Control': 'max-age=315360000, no-transform, public'} }

	if(!secrets) {
		console.log('You need to make a secrets file in the root directory with your AWS info!  Check the README.');
	}

	return gulp.src("./web/public/photos.json")
        .pipe(s3({
		  "key": secrets.accessKeyId,
		  "secret": secrets.secretAccessKey,
		  "bucket": "shoptology-photo-booth"
		}, options));

});


