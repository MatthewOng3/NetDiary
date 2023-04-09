const Joi = require('joi')
const passwordComplexity  = require('joi-password-complexity')

//Validate data before saving to database
function validate(user){

    const complexityOptions = {
        min: 8,
        max: 1024,
        numeric: 1,
        // symbol: 1,
        // requirementCount: 4,
    };
    
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: passwordComplexity(complexityOptions).required()
    })
     
    return schema.validate(user);
}

module.exports = validate