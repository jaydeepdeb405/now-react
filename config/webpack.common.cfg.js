const path = require('path');

module.exports = {
    entryPath: path.resolve(__dirname, '../src/index.js'),
    contentBasePath: path.resolve(__dirname, '../src'),
    outputPath: path.resolve(__dirname, '../dist'),
    rules: [
        {
            /*
             * Babel loaders/presets
             */
            test: /\.js$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env', 
                            '@babel/preset-react'
                        ],
                        plugins: [
                            [
                              "@babel/plugin-proposal-class-properties"
                            ]
                        ]
                    }
                }
            ]
        },
        {
            /*
             * CSS/SASS loaders
             */
            test: /\.(sa|sc|c)ss$/i,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }
    ]
}