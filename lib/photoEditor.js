'use strict;';

var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec;

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
		
		photos.forEach(function(photo) {
			fs.renameSync(inDir + photo, tmpDir + photo);
		});
		
		console.log('Move complete.');

		// Creating script
		generateScript(photos, outDir);

		console.log('******************', process.platform);

		switch(process.platform) {
			case 'win32':
				// Windows script;
				console.log('Starting Windows script...');
				// Create windows script...then
				exec("lib\\bridge.vbs", function(error, stdout, stderr) {
					console.log('****RESULT****');
					console.log(error, stdout, stderr);
				});
				break;
			case 'darwin':
				// Mac script;
				console.log('Starting OS X script...');
				exec('osascript ' + libDir + 'bridge.scpt', function(error, stdout, stderr) {
					console.log('****RESULT****');
					console.log(error, stdout, stderr);
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
		})
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