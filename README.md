# Shoptology Photo Booth scripts

### Installation
*	Clone the repo  
*	Install ffmpeg on your system:
```
OSX: brew install ffmpeg  
WIN: 
-Download the most recent package at: https://www.ffmpeg.org/download.html  
-Extract
-Add path to binary to Environment Variables
```
*	Run 'npm install'  
*	Add a secrets.js with the following information:  

```javascript
var secrets = {
    accessKeyId: '',
    secretAccessKey: ''
}

module.exports = secrets;
```

With your approved Shoptology AWS information.

*	Run 'gulp watch' and throw some photos into the 'in' folder!