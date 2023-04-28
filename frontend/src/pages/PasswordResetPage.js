import { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Colors } from "../constants/Colors";
import Button from "../components/utils/Button";

function ResetPasswordPage(){
    const [validated, setValidated] = useState(false);
	const [resetPassResponseState, setResetPassResponseState] = useState({success: "", error: "", status: "",loading: false, disabled: false}) 

	function handleSubmit(event){
		event.preventDefault();
        event.stopPropagation();

         
	};

    return(
        <div className="root">
			<div className="formComponent">
				<h1 style={{color: 'white', fontWeight: 'normal', marginLeft: '10px', marginBottom: '20px'}}>Welcome</h1>
				<Form noValidate validated={validated} onSubmit={handleSubmit} className='inputComponent width-condition' style={{width: '30%'}}>
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label className="text-light">Old Password</Form.Label>
						<Form.Control
							name="password"
							required
							type="password"
							placeholder="Enter old password"
						/>
					</Form.Group>
                    <Form.Group className="mb-3" controlId="formNewPassword">
						<Form.Label className="text-light">New Password</Form.Label>
						<Form.Control
							name="password"
							required
							type="password"
							placeholder="Enter new password"
						/>
					</Form.Group>
					<Button width='100%' height='40px' color={Colors.light_purple100}>
						{resetPassResponseState && resetPassResponseState.loading === true ? (
							<Spinner as="span" animation="border" size="sm" role="status"/>
						) : ("")}
						Confirm
					</Button>
					<Alert show={resetPassResponseState.error !== ""} variant="danger">
						{resetPassResponseState.error}
					</Alert>
				</Form>
			</div>
		</div>
    )
}

export default ResetPasswordPage;