
const Dotenv = require("dotenv-webpack");


module.exports = {
    entry: './frontend/src/App.js',
    plugins: [
        new Dotenv()
    ]
}