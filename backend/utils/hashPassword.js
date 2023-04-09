const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(14) //Secure even more

function hashPassword(password){
    return bcrypt.hashSync(password, salt)
}

function comparePasswords(inputPassword, hashedPassword){
    return bcrypt.compareSync(inputPassword, hashedPassword)
}

module.exports = {hashPassword, comparePasswords}