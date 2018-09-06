let path = require('path');
module.exports = {
    entry: "./src/app/scripts/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    devServer: {
        publicPath: '/dist/',
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "awesome-typescript-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|png)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 20000
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    mode: 'development'
};