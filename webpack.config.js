'use strict';

const path = require('path');
const webpack = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const liveReloadConfig = {
    protocol: 'http'
};
function getStyleUse(bundleFilename) {
    return [
        {
            loader: 'file-loader',
            options: {
                name: bundleFilename,
            },
        },
        { loader: 'extract-loader' },
        { loader: 'css-loader' },
        {
            loader: 'sass-loader',
            options: {
                includePaths: ['./node_modules'],
                implementation: require('dart-sass'),
                fiber: require('fibers'),
            }
        },
    ];
}

module.exports = [
    {
        entry: ["./src/index.js"],
        output: {
            library: 'ReactMarkdown',
            filename: "bundle-index.js"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                }
            ]
        },
        plugins: [
            new LiveReloadPlugin(liveReloadConfig)
        ]
    },
    {
        entry: ["./src/guide.jsx"],
        output: {
            library: 'ReactMarkdown',
            filename: "bundle-guide.js"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                }
            ]
        },
        plugins: [
            new LiveReloadPlugin(liveReloadConfig)
        ]
    },
    {
        entry: './stylesheets/index.scss',
        output: {
            // This is necessary for webpack to compile, but we never reference this js file.
            filename: 'style-bundle-index.js',
        },
        module: {
            rules: [{
                test: /index.scss$/,
                use: getStyleUse('bundle-index.css')
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ]
            }]
        },
        plugins: [
            new LiveReloadPlugin(liveReloadConfig)
        ]
    }
];
