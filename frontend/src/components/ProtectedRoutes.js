import { Outlet, Navigate } from "react-router-dom";


function ProtectedRoutes({admin}){
	//If there is admin authentication 
	if(admin){
		let adminAuth = true;
		return adminAuth ? <Outlet/> : <Navigate to='/login'/>
	}
	else{
		let userAuth = true;
		return userAuth ? <> <Outlet/> </> : <Navigate to='/login'/>
	}
	
}

export default ProtectedRoutes;