import { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Colors } from "../constants/Colors";

import cleanInputData from "../security/CleanInputData";
import { useNavigate, useParams } from "react-router-dom";
import OwnButton from "../components/utils/OwnButton";
import api from "../util/api";

/**
 * @description Page for users are redirected to after clicking the link in their email, input old and new password to change password
 * @author Matt
 * @access public
 * @path /password-reset/:token
 */
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [validated, setValidated] = useState(false);
	const [resetPassResponseState, setResetPassResponseState] = useState({ success: "", error: "", status: "", loading: false, disabled: false });
	const { token } = useParams();

	/**
	 * @description Checks if the password match
	 */
	function onChange() {
		const password = document.querySelector("input[name=password]")
		const confirm = document.querySelector("input[name=confirmPassword]")
		if (confirm.value === password.value) {
			confirm.setCustomValidity("")
		} else {
			confirm.setCustomValidity("Passwords do not match")
		}
	}

	/**
	 * @description Submit the new password to backend and handle the password update
	 * @param event Access values in form events
	 * @returns response from server if password has been updated or if there was an issue
	 */
	function handleSubmit(event) {
		event.preventDefault();
		event.stopPropagation();

		const form = event.currentTarget.elements;
		const newPassword = cleanInputData(form.newPassword.value)

		if (event.currentTarget.checkValidity() === true && newPassword) {
			setResetPassResponseState({ loading: true, disabled: true });

			api.post('/user/reset-password', { newPassword: newPassword, shareToken: token }).then((res) => {
				//If authentication is successful navigate to login page
				if (res.data.auth) {
					setResetPassResponseState({ success: res.data.message, loading: false, error: "" })
					navigate("/login", { replace: true })
				}
				else {
					setResetPassResponseState({ success: undefined, loading: false, error: res.data.message })
				}
			}).catch((err) => {
				setResetPassResponseState({ error: err.response.message, loading: false, disabled: false });
			});
		}

		setValidated(true);
	};

	return (
		<div className="root">
			<div className="formComponent">
				<h1 style={{ color: 'white', fontWeight: 'normal', marginLeft: '10px', marginBottom: '20px' }}>Reset Password</h1>
				<Form noValidate validated={validated} onSubmit={handleSubmit} className='inputComponent width-condition' style={{ width: '30%' }}>
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label className="text-light">New Password</Form.Label>
						<Form.Control
							name="newPassword"
							required
							type="password"
							placeholder="Enter password"
							minLength={8}
							onChange={onChange}
						/>
						<Form.Control.Feedback type="invalid">
							Please anter a valid password
						</Form.Control.Feedback>
						<Form.Text className="text-muted">
							Password should have at least 8 characters consisting of 1 numeric character
						</Form.Text>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
						<Form.Label className="text-light">Confirm Password</Form.Label>
						<Form.Control
							name="confirmPassword"
							required
							type="password"
							placeholder="Confirm password"
							minLength={8}
							onChange={onChange}
						/>
						<Form.Control.Feedback type="invalid">
							Both passwords should match
						</Form.Control.Feedback>
					</Form.Group>
					<OwnButton width='100%' height='40px' color={Colors.light_purple100}>
						{resetPassResponseState && resetPassResponseState.loading === true ? (
							<Spinner as="span" animation="border" size="sm" role="status" />
						) : ("")}
						Confirm
					</OwnButton>
					<Alert show={resetPassResponseState.loading === false && resetPassResponseState.error} variant="danger">
						{resetPassResponseState.error}
					</Alert>
					<Alert show={resetPassResponseState.success && resetPassResponseState.loading === false} variant="info" style={{ marginTop: '10px' }}>
						{resetPassResponseState.success}
					</Alert>
				</Form>
			</div>
		</div>
	)
}

export default ResetPasswordPage;