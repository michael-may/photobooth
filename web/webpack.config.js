var webpack = require('webpack');

// https://github.com/petehunt/webpack-howto
// http://webpack.github.io/docs/configuration.html

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
    context: __dirname + "/public/app",
    entry: {
        home: "./home"
    },
    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        path: __dirname + "/public/js/",
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js",
        publicPath: '/js/'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
            { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.woff2$/,  loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.ttf$/,    loader: "file-loader" },
            { test: /\.eot$/,    loader: "file-loader" },
            { test: /\.svg$/,    loader: "file-loader" }
        ]
    },
    plugins: [commonsPlugin],
    resolve: {
        root: __dirname,
        modulesDirectories: [
            'node_modules',
            'public/bower_components'
        ]
    }
};
