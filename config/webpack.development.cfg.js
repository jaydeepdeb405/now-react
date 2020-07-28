const webpack = require('webpack');
const commonConfig = require('./webpack.common.cfg');
const servicenowConfig = require('../servicenow.config');

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', commonConfig.entryPath],
    output: {
        filename: 'bundle.js',
        path: commonConfig.outputPath
    },
    module: {
        rules: [
            ...commonConfig.rules,
            {
                /*
                 * Image loaders without path settings
                 */
                test: /\.(jpg|png|bmp|gif|jpeg|ico|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: commonConfig.contentBasePath,
        historyApiFallback: true,
        port: servicenowConfig.DEV_SERVER_PORT,
        open: true,
        proxy: {
            '/api': {
                target: servicenowConfig.HOST,
                secure: false,
                changeOrigin: true
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.USERNAME': JSON.stringify(
                servicenowConfig.USERNAME
            ),
            'process.env.PASSWORD': JSON.stringify(
                servicenowConfig.PASSWORD
            ),
            'process.env.HOST': JSON.stringify(
                servicenowConfig.HOST
            ),
            'process.env.APP_URL_BASE': JSON.stringify(
                ''
            )
        })
    ]
};