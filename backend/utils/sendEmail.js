require('dotenv').config();
const sgMail = require('@sendgrid/mail')

/**
 * @description Send email to user based on tempalte data and template id
 * @returns Object detailing result message and boolean value
 * @author Matt
 */
async function sendEmail(email, subject, template_id, dynamic_template_data){
	try {
		 
		//Set api key
		sgMail.setApiKey(process.env.SENDGRID_API_KEY)
		 
		const msg = {
			to: email, // Change to your recipient
			from: process.env.MAIL_USER, // Change to your verified sender
			subject: subject,
			template_id: template_id, //template id of template
            dynamic_template_data: dynamic_template_data, //data to be inputed in placeholders in the template
		}
		
		//Send mail
		await sgMail.send(msg)
		
		return {message: "Email Sent!", auth: true};
	} catch (error) {
		console.log(error);
		return {message: "Error Sending email", auth: false};
	}
};

module.exports = {sendEmail}