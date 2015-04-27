# Shoptology Photo Booth Gallery

Provide a web accessible area for users to find their generated Gifs.

## Development

### Javascript and SASS

`npm i -g webpack-dev-server` and then use `npm start` and visit http://localhost:8080. Note - I didn't setup the "hot" reload option for webpack-dev-server. Didn't really like the way it requires adding additional script tags and editing the entry point config. Not sure it's possible to use webpack, browsersync and gulp together. There's an open issue about it: https://github.com/webpack/webpack-dev-server/issues/56

Before committing to move to production, run `npm run compile` to optimize and minify the assets. There will be some warnings caused by the libraries we are using. They should be safe to ignore.

Ex.
```
WARNING in home.bundle.js from UglifyJs
Condition always false [/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/style-loader!/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/css-loader!/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/sass-loader!../scss/home.scss:9,0]
Dropping unreachable code [/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/style-loader!/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/css-loader!/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/sass-loader!../scss/home.scss:11,0]
Side effects in initialization of unused variable update [/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/style-loader!/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/css-loader!/Users/rmarscher/Code/shoptology/seasonlink/web-static/~/sass-loader!../scss/home.scss:7,0]

```

### HTML

The generator folder has jade templates that can be compiled into the html in the public folder using `wintersmith build` from the generator folder.
Would like to create a workflow that watches the generator and public folders and automatically compiles everything with webpack and wintersmith.

