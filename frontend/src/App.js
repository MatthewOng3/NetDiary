import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'


//Components
import ProtectedRoutes from './components/ProtectedRoutes'

//Publicily available routes
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import SharedPage from './pages/SharedPage'

//User available routes
import FeedbackPage from './pages/FeedbackPage'
import DiaryPage from './pages/user/DiaryPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import ResetPasswordPage from './pages/PasswordResetPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

function App() {
	
	
  return (
    <BrowserRouter>
		<Routes>
			<Route>
				{/*Publicly available routes:*/}
				<Route path='/' element={<HomePage/>}/>
				<Route path='/login' element={<LoginPage/>}/>
				<Route path='/register' element={<RegisterPage/>}/>
				<Route path='/contact' element={<ContactPage/>}/>
				<Route  path='/feedback' element={<FeedbackPage/>}/>
				<Route  path='/shared/:collectionId/:catId' element={<SharedPage/>}/>
				<Route  path='/forgot-pass' element={<ForgotPasswordPage/>}/>
				<Route  path='/password-reset/:token' element={<ResetPasswordPage/>}/>
				{/*User protected routes:*/}
				{/* <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn}/>} path='/user/*'> */}
				<Route path='/users/:id/verify/:token' element={<EmailVerificationPage/>}/>
				<Route element={<DiaryPage/>} path='/user/net-diary' exact/>
				{/* </Route> */}
			</Route>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
