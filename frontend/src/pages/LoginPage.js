import { Form, Alert } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/utils/Button";
import '../styles/AuthForm.css'
import { Colors } from "../constants/Colors";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCurrentCollection } from "../store/collectionSlice";

import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setLoginState, setShareToken } from "../store/userSlice";
 

/**
 * Login page component that allows users to log in from either a net diary account or gmail account, seperate function handlers for them
*/
function LoginPage(){
    const [validated, setValidated] = useState(false);
	//State to handle spinner login response
	const [loginUserResponseState, setLoginUserResponseState] = useState({success: "", error: "", status: "",loading: false, disabled: false}) 
	const navigate = useNavigate()
	const dispatch = useDispatch()

	//Check if user is authorized
	// function userAuthenticated(){
	// 	axios.get("http://localhost:3001/api/user/isAuth", {headers: {
	// 		"x-access-token": localStorage.getItem("token"),
	// 		"Content-Type": 'application/json',
	// 	}})
	// 	.then((res)=>{console.log('AUTHENTICATED')})
	// 	.catch((err) => {console.log(err)})
	// }

	//Handles submitting login attempt
	function handleSubmit(event){
		
		event.preventDefault();
		event.stopPropagation();

		const form = event.currentTarget.elements;

		//Get relevant data from form 
		const email = form.email.value
		const password = form.password.value
		const doNotLogout = form.doNotLogout.checked 

		//If it passes validaty
		if (event.currentTarget.checkValidity() === true && email && password) {
			setLoginUserResponseState({loading: true, disabled: true}) //Set the loading state to true
			
			//Send post request to api endpoint to log user in
			axios.defaults.withCredentials = true
			axios.post(process.env.REACT_APP_API_URL + "user/login", {email, password, doNotLogout}) 
			.then((res) => {
				setLoginUserResponseState({success: res.data.message, loading: false, error: ""})
				
				//If back end validation is successful, navigate to net diary page
				if(res.data.auth){
					//Update the current collection id local state
					dispatch(updateCurrentCollection(res.data.collectionId))
					//Dispatch action to store to set Login state to true
					dispatch(setLoginState(true))
					//Set share token state
					dispatch(setShareToken(res.data.shareToken))
					navigate("/user/net-diary", {replace: true}) //Replace deletes history of webpages so you cant go back to login page
				}
				
			}) 
			.catch((err) => {
				setLoginUserResponseState({error: err.data.message ? err.data.message : err.data, status: err.status})
			})
		} 
		setValidated(true);
	};

	//Handles logging in with google
	function googleLoginHandler(response){
		
		//Retrieve token from google api
		const google_token = response.credential
		setLoginUserResponseState({ loading: true, disabled: true });
		
		//Send post request to log user in using google
		axios.defaults.withCredentials = true;
		 
		axios.post(process.env.REACT_APP_API_URL + 'user/google-login', {google_token})
		  .then((res) => {
			setLoginUserResponseState({
			  success: res.data.message,
			  loading: false,
			  error: '',
			});
			
			//If authentication is succesful navigate to main app page
			if (res.data.auth) {
				dispatch(updateCurrentCollection(res.data.collectionId))
				dispatch(setLoginState(true))
			  	navigate('/user/net-diary', { replace: true });
			}
		  })
		  .catch((err) => {
			setLoginUserResponseState({
			  error: err.data.message ? err.data.message : err.data,
			  status: err.status,
			});
		  });
	}
	
	//Set error state if error with google auth
	function handleLoginError(error){
		setLoginUserResponseState({error: error})
	}

    return(
		<div className="root">
			<div className="formComponent">
				<h1 style={{color: 'white', fontWeight: 'normal', marginLeft: '10px', marginBottom: '20px'}}>Welcome</h1>
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
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label className="text-light">Password</Form.Label>
						<Form.Control
							name="password"
							required
							type="password"
							placeholder="Enter password"
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicCheckbox">
						<Form.Check
							name="doNotLogout"
							type="checkbox"
							className="text-light"
							label='Keep me signed in'
						/>
					</Form.Group>
					{/* <div className=" mb-3 flex items-center justify-center">
						<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID} > 
							<GoogleLogin onSuccess={googleLoginHandler} onError={handleLoginError} shape="circle" theme="filled_blue"/>
						</GoogleOAuthProvider>
					</div> */}
					<Button width='100%' height='40px' color={Colors.light_purple100}>
						{loginUserResponseState && loginUserResponseState.loading === true ? (
							<Spinner as="span" animation="border" size="sm" role="status"/>
						) : ("")}
						Sign In
					</Button>
					<div className="goToRegisterContainer">
						<span style={{color: 'white', marginRight: '10px', marginLeft: '30px'}}>Don't have an account?</span>
						<Link to={"/register"}> Register </Link>
					</div>
					<Alert show={loginUserResponseState && (loginUserResponseState.error === "Invalid credentials" || loginUserResponseState.status === '401')} variant="danger">
						Wrong Credentials!
					</Alert>
				</Form>
			</div>
		</div>
    )
}

export default LoginPage;