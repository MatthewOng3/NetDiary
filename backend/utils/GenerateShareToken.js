const crypto = require('crypto');

/**
 * Function to generate random string value for share token
 */
function generateShareToken() {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}

module.exports = {generateShareToken};