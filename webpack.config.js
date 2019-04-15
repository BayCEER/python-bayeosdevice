var path = require('path');

module.exports = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'bayeosdevice/static/js'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.jsx'
        ]
    }
};