const webpack = require('webpack');
const commonConfig = require('./webpack.common.cfg');
const servicenowConfig = require('../servicenow.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: commonConfig.entryPath,
    output: {
        filename: 'bundle.js',
        path: commonConfig.outputPath
    },
    module: {
        rules: [ 
            ...commonConfig.rules,
            {
                /*
                 * Image loaders with output & public path settings
                 */
                test: /\.(jpg|png|bmp|gif|jpeg|ico|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: '[name].[ext]',
                            outputPath: 'images',
                            publicPath: '/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.APP_URL_BASE': JSON.stringify(
                servicenowConfig.APP_URL_BASE
            )
        })
    ]
};