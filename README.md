# Shoptology Photo Booth

### Installation
*	Clone the repo  
*	Install ffmpeg and graphicsmagick on your system:
```
OSX: 
-brew install ffmpeg 
-brew install graphicsmagick
WIN: 
-Download the most recent ffmpeg package at: https://www.ffmpeg.org/download.html  
-Extract
-Add path to binary to Environment Variables
-Download the graphicsmagick installer at: http://www.graphicsmagick.org/download.html
```
*	Run ```npm install```  
*	Add a secrets.js with the following information:  

```javascript
var secrets = {
    accessKeyId: '',
    secretAccessKey: ''
}

module.exports = secrets;
```

* Add your approved Shoptology AWS information.
*	Run 'gulp watch' and throw some photos into the 'in' folder!

