import {BrowserRouter, Routes, Route} from 'react-router-dom'


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
				{/*User protected routes:*/}
				<Route element={<ProtectedRoutes admin={false}/>}>
					<Route path='/user/netdiary' element={<DiaryPage/>}/>
					<Route path='/user/feedback' element={<FeedbackPage/>}/>
				</Route>
			</Route>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
