'use strict;';

var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	ffmpeg = require('fluent-ffmpeg'),
	gify = require('gify'),
	gifer = require('gifer');

var PhotoEditor = function() {
	var self = this,
		tmpDir = './tmp/',
		libDir = './lib/',
		actionScriptTemplate = 'actions.jsx.template';

	this.edit = function edit(photos, inDir, outDir) {
		cleanWorkingFiles();
		
		console.log('Creating new tmp directory...');
		
		fs.mkdirSync(tmpDir);

		console.log('Directory created.');
		console.log('Moving files...');
		
		var photoList = [];
		for(var i = 0; i < photos.length; i++) {
			// Let's get some zero padding on this guy
			var z = '000' + (i + 1),
				photo = 'IMG_' + z.substr(z.length - 4) + '.jpg';

			fs.renameSync(inDir + photos[i], tmpDir + photo);
			photoList.push(photo);
		}
		
		console.log('Move complete.');

		// Creating script
		var numFiles = generateScript(photoList, outDir);

		switch(process.platform) {
			case 'win32':
				// Windows script;
				console.log('Starting Windows script...');
				// Create windows script...then
				exec("lib\\bridge.vbs", function(error, stdout, stderr) {
					console.log(error, stdout, stderr);
					generateMedia(photos, outDir, numFiles);
				});
				break;
			case 'darwin':
				// Mac script;
				console.log('Starting OS X script...');
				exec('osascript ' + libDir + 'bridge.scpt', function(error, stdout, stderr) {
					console.log(error, stdout, stderr);
					generateMedia(photos, outDir, numFiles);
				});
				break;
		}
	};

	var generateScript = function generateScript(files, outDir) {
		var actionScript = fs.readFileSync(libDir + actionScriptTemplate).toString(),
			fileList = '[';

		for(var i = 0; i < files.length; i++) {
			fileList += "'" + path.resolve(tmpDir + files[i]).replace(/\\/g, '\\\\') + "'";

			if(i !== files.length - 1) {
				fileList += ', ';
			}
		}

		fileList += ']';

		actionScript = actionScript.replace('##FILELIST##', fileList);
		actionScript = actionScript.replace('##WORKINGDIR##', "'" + path.resolve(tmpDir).replace(/\\/g, '\\\\') + "'");
		actionScript = actionScript.replace('##OUTDIR##', "'" + path.resolve(outDir).replace(/\\/g, '\\\\') + "'");

		fs.writeFile(libDir + actionScriptTemplate.replace('.template', ''), actionScript, function(err) {
			if(err) {
				console.log(err);
			}

			// Script generated successfully
		});

		return files.length;
	};

	// Let's make some movies!
	var generateMedia = function generateMedia(files, outDir, numFiles) {

		console.log('Rendering mp4...');

		var name = new Date().toISOString().replace(/-/g, '').replace('T', '').replace(/:/g, '').slice(4, 14)

		var ffmpegCommand = ffmpeg()
			.input(path.resolve(tmpDir) + '/IMG_%04d.jpg')
			.inputOptions([

			])
			.outputOptions([
				'-r 30',
				//'-t ' + (Math.round(files.length / 6),
				'-b 10000k',
				'-s 640x640',
				'-vcodec libx264',
				'-pix_fmt yuv420p'
			])
			.on('progress', function(progress) {
				//console.log(progress.precent);
			})
			.on('error', function(err, stdout, stderr) {
				//console.log(err.message);
			})
			.on('end', function() {
				console.log('Video saved!');
				console.log('Rendering gif...');
				var fun;

				// TODO: Resolve or remove this;
				if(process.platform == 'win32') {
					fun = gify;
				} else {
					fun = gifer;
					fun = gify;
				}

				fun(path.resolve(tmpDir + name + '.mp4'), path.resolve(tmpDir + name + '.gif'), function(err) {
					if(err) {
						console.log(err);
						return;
					}
					console.log('Gif saved!');
					var vid = path.resolve(tmpDir + name + '.mp4');
					var ffmpegCommand = ffmpeg()
						.input(path.resolve(tmpDir) + '/IMG_%04d.jpg')
						.inputOptions([
							'-loop 1'
						])
						.outputOptions([
							'-r 30',
							//'-t ' + (Math.round(files.length / 6),
							'-b 10000k',
							'-s 640x640',
							'-vcodec libx264',
							'-pix_fmt yuv420p',
							'-t ' + getMinTime(numFiles, 30, 3)
						])
						.on('end', function() {
							moveMedia(name, outDir);
							cleanWorkingFiles();
						})
						.save(tmpDir + name + '.mp4');
				});
			})
			.save(tmpDir + name + '.mp4');
	};

	var moveMedia = function moveMedia(name, outDir) {
		fs.renameSync(tmpDir + name + '.mp4', outDir + name + '.mp4');
		fs.renameSync(tmpDir + name + '.gif', outDir + name + '.gif');
	};

	var getMinTime = function getMinTime(files, rate, seconds) {
		var loops = 0;

		for(var i = 0; (files / rate) * i < seconds; i++) {
			loops = i;
		}

		return formatSecondsAsTime((files / rate) * (loops + 1));
	};

	var formatSecondsAsTime = function formatSecondsAsTime(seconds) {
		var hr  = Math.floor(seconds / 3600);
		var min = Math.floor((seconds - (hr * 3600))/60);
		var sec = Math.floor(seconds - (hr * 3600) -  (min * 60));
 
		if(hr < 10) {
			hr = "0" + hr;
		}
		if(min < 10) {
			min = "0" + min;
		}
		if(sec < 10) {
			sec = "0" + sec;
		}
		if(hr) {
			hr = "00";
		}

		return hr + ':' + min + ':' + sec;
	};

	var cleanWorkingFiles = function emptyTmpDir() {
		console.log('Removing tmp directory...');
		
		try {
			var dir = fs.readdirSync(tmpDir);
			if(dir) {
				dir.forEach(function(file) {
					fs.unlinkSync(tmpDir + file);
				});
				fs.rmdirSync(tmpDir);
				
				console.log('Directory removed.');
			}
		} catch(err) {
			console.log('Directory clean.');
		}

		//console.log('Removing generated scripts...');

		try {
			fs.unlinkSync(tmpDir + actionScriptTemplate.replace('.template', ''));

			//console.log('Generated scripts removed.');
		} catch(err) {
			//console.log('Scripts clean.');
		}
	};
};


module.exports = new PhotoEditor();