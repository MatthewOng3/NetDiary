//Frontend
import { Form, Alert } from "react-bootstrap";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import '../styles/AuthForm.css'

import { Colors } from "../constants/Colors";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCurrentCollection } from "../store/collectionSlice";

//Backend and security
import axios from 'axios'
import cleanInputData from '../security/CleanInputData'
import ReCAPTCHA from "react-google-recaptcha";
import ErrorModal from "../components/utils/ErrorModal";
import OwnButton from "../components/utils/OwnButton";

/**
 * @description Page to allow users to register to webapp
 * @author Matt
 * @access public
 * @path /register
 */
function RegisterPage() {
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    const [registerUserResponseState, setRegisterUserResponseState] = useState({ success: false, error: "", status: "", loading: false, disabled: false })
    const captchaRef = useRef(null)
    const dispatch = useDispatch()


    //Checks if password and confirm password match
    const onChange = () => {
        const password = document.querySelector("input[name=password]")
        const confirm = document.querySelector("input[name=confirmPassword]")
        if (confirm.value === password.value) {
            confirm.setCustomValidity("")
        } else {
            confirm.setCustomValidity("Passwords do not match")
        }
    }

    //Checks if the form is valid, if not it stops the event from happening
    const handleSubmit = (event) => {

        event.preventDefault();
        event.stopPropagation();

        //Retrieve response token from reCAPTCHA and reset code that resets each time the form is submitted
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();

        if (!token) {
            setValidated(false);
            return;
        }

        const form = event.currentTarget.elements;

        //Get relevant data from form 
        const username = cleanInputData(form.username.value)
        const email = cleanInputData(form.email.value)
        const password = cleanInputData(form.password.value)

        if (event.currentTarget.checkValidity() === true && email && password && username) {
            setRegisterUserResponseState({ loading: true, disabled: true, error: "" }) //Set the loading state to true

            //Send post request with user credentials to api endpoint
            axios.defaults.withCredentials = true

            axios.post(`${process.env.REACT_APP_API_URL}user/register`, { user_data: { username: username, email: email, password: password }, token: token }).then((res) => {

                //If user registers successfully
                if (res.data.success && res.data.captcha) {
                    //Reupdate state to re enable button and disable loading spinner
                    setRegisterUserResponseState({ success: res.data.success, loading: false, error: "", disabled: false })

                    //Set current collection id state with the collectionId field from express response
                    dispatch(updateCurrentCollection(res.data.collectionId))

                    //Navigate to login page
                    navigate("/login", { replace: true })
                }
            }).catch(err => {
                setRegisterUserResponseState({ error: err.response.data.message, status: err.response.status, loading: false })
            })
        }
        setValidated(true);
    };

    function closeErrorModal() {
        setRegisterUserResponseState({ error: undefined })
    }


    return (
        <div className="root">
            <div className="formComponent">
                <h1 style={{ color: 'white', fontWeight: 'normal', marginLeft: '10px', marginBottom: '20px' }}>Create an Account</h1>
                <Form noValidate validated={validated} onSubmit={handleSubmit} className='inputComponent'>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label className="text-light">Username</Form.Label>
                        <Form.Control
                            name="username"
                            required
                            type="username"
                            placeholder="Enter username"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-light">Email address</Form.Label>
                        <Form.Control
                            name="email"
                            required
                            type="email"
                            placeholder="Enter email"
                        />
                        <Form.Control.Feedback type="invalid">
                            Please anter a valid email address
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="text-light">Password</Form.Label>
                        <Form.Control
                            name="password"
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
                    <div className="flex flex-col items-center">
                        <ReCAPTCHA sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY} ref={captchaRef} className="mb-2" />
                        <OwnButton width='80%' height='40px' color={Colors.light_purple100} disabled={registerUserResponseState.disabled}>
                            Sign Up
                            {registerUserResponseState && registerUserResponseState.loading === true ? (
                                <Spinner as="span" animation="border" size="sm" role="status" className="ml-3" />
                            ) : ("")}
                        </OwnButton>
                        <div style={{ marginTop: '10px' }}>
                            <span style={{ color: 'white', marginRight: '10px' }}>Do you have an account already?</span>
                            <Link to={"/login"}> Login </Link>
                        </div>
                    </div>
                    <Alert show={registerUserResponseState.error !== "" && registerUserResponseState.error !== undefined} variant="danger">
                        {registerUserResponseState.error}
                    </Alert>
                    <Alert show={registerUserResponseState.success} variant="info">
                        User created
                    </Alert>
                </Form>
                <ErrorModal isOpen={registerUserResponseState.error} onClose={closeErrorModal}>{registerUserResponseState.error}</ErrorModal>
            </div>
        </div>
    )
}

export default RegisterPage;