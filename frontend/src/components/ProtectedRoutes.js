import { Navigate, Outlet } from "react-router-dom";
 
import { useState, useEffect } from 'react'
import axios from 'axios'
 
import { useDispatch, useSelector } from 'react-redux'
import { getLoggedInStatus, verifyLoggedIn } from '../store/userSlice'
/**
 * Component to validate if a user has access to a particular page, for some reason the below code doesnt work 
 */
function ProtectedRoutes({isLoggedIn}){
	 
	console.log(isLoggedIn, 'PROTECTED ROUTE')
	if (!isLoggedIn) {
		return <Navigate to="/login"  replace />;
	}
	
	return <Outlet/>
}

export default ProtectedRoutes;