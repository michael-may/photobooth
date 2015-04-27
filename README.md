# Shoptology Photo Booth

### Installation
* Clone the repo

* Run ```npm install```

* Add a secrets.js with the following information:

```javascript
var secrets = {
    accessKeyId: '',
    secretAccessKey: ''
}

module.exports = secrets;
```

* Add your approved Shoptology AWS information.

* Run ```gulp watch``` and throw some photos into the 'in' folder!