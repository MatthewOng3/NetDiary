import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'


//Components
import ProtectedRoutes from './components/ProtectedRoutes'

//Publicily available routes
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'

//User available routes
import FeedbackPage from './pages/user/FeedbackPage'
import DiaryPage from './pages/user/DiaryPage'


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
				{/*User protected routes:*/}
				{/* <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn}/>} path='/user/*'> */}
				
				<Route element={<DiaryPage/>} path='/user/net-diary' exact/>
				
				
			
				{/* </Route> */}
				
			</Route>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
