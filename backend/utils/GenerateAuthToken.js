const jwt = require('jsonwebtoken')
require('dotenv').config();

const generateAuthToken = (_id, username, email) => {
    const token = jwt.sign({_id, username, email}, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1m'})
    return token
}

const generateRefreshToken = (_id, username, email) => {
    const token = jwt.sign({_id, username, email}, process.env.JWT_REFRESH_TOKEN, { expiresIn: '2d'})
    return token
}

module.exports = {generateAuthToken, generateRefreshToken};