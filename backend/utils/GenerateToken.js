const crypto = require('crypto');

/**
 * Function to generate random string value for share token
 */
function generateToken() {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}

module.exports = {generateToken};