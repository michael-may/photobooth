# Shoptology Photo Booth scripts

### Installation
Clone the repo
Run 'npm install'
Add a secrets.js with the following information:

```javascript
var secrets = {
    accessKeyId: '',
    secretAccessKey: ''
}

module.exports = secrets;
```

With your approved Shoptology AWS information.

run 'gulp watch' and throw some photos into the 'in' folder!