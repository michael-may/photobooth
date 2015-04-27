webpackJsonp([2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(2);

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"!!/Users/michaelstancliffe/Projects/photobooth/web/node_modules/css-loader/index.js!/Users/michaelstancliffe/Projects/photobooth/web/node_modules/sass-loader/index.js!/Users/michaelstancliffe/Projects/photobooth/web/public/scss/home.scss\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/michaelstancliffe/Projects/photobooth/web/node_modules/css-loader/index.js!/Users/michaelstancliffe/Projects/photobooth/web/node_modules/sass-loader/index.js!/Users/michaelstancliffe/Projects/photobooth/web/public/scss/home.scss", function() {
			var newContent = require("!!/Users/michaelstancliffe/Projects/photobooth/web/node_modules/css-loader/index.js!/Users/michaelstancliffe/Projects/photobooth/web/node_modules/sass-loader/index.js!/Users/michaelstancliffe/Projects/photobooth/web/public/scss/home.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }
]);