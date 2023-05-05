import { useState } from "react";
import axios from "axios";
import { Form, Alert } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Colors } from "../constants/Colors";
import cleanInputData from "../security/CleanInputData";
import Button from "../components/utils/Button";
import '../styles/ResetPassword.css'

/**
 * @description Page for users to input their email to receive reset password link
 * @author Matt
 * @access public
 */
function ForgotPasswordPage(){
    const [validated, setValidated] = useState(false);
	const [sendEmailResponse, setSendEmailResponse] = useState({success: "", error: "", loading: false, disabled: false}) 

    /**
     * @description Sends email to backend server to verify and send the email link
     * @param event The form values users input
     */
	function handleSubmit(event){
		event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget.elements;
        const email = cleanInputData(form.email.value)
   
        if (event.currentTarget.checkValidity() === true && email && cleanInputData(email)) {
            setSendEmailResponse({ loading: true, disabled: true });

            axios.post(process.env.REACT_APP_API_URL + 'user/verify-email', {email: email}).then((res)=>{
				if(res.data.auth){
					setSendEmailResponse({success: res.data.message, loading: false, error: undefined})
				}
                else{
					setSendEmailResponse({success: undefined, loading: false, error: res.data.message})
				}
            }).catch((err)=>{
                setSendEmailResponse({error: err.response.message, loading: false, disabled: false});
            });
        
        }
        setValidated(true);
	};
	
	return (
		<div className="root">
			<div className="formComponent ">
				<h1 style={{color: 'white', fontWeight: 'normal', marginLeft: '10px', marginBottom: '20px'}}>Reset Password</h1>
				<Form noValidate validated={validated} onSubmit={handleSubmit} className='inputComponent width-condition' style={{width: '30%'}}>
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Label className="text-light">Email address</Form.Label>
						<Form.Control
							name="email"
							required
							type="email"
							placeholder="Enter email"
						/>
					</Form.Group>
					<Button width='100%' height='40px' color={Colors.light_purple100}>
						{sendEmailResponse && sendEmailResponse === true ? (
							<Spinner as="span" animation="border" size="sm" role="status"/>
						) : ("")}
						Send email verification
					</Button>
					 
					<Alert show={sendEmailResponse.error !== "" && sendEmailResponse.error !== undefined && sendEmailResponse.loading === false} variant="danger">
						{sendEmailResponse.error}
					</Alert>
					<Alert show={sendEmailResponse.success && sendEmailResponse.loading === false} variant="info" style={{marginTop: '10px' }}>
						{sendEmailResponse.success}
					</Alert>
					 
				</Form>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;