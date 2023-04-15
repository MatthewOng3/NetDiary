import {IconButton} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
 
import { Button } from 'react-bootstrap';
import SideDrawer from './SideDrawer';
import '../styles/DiaryNavbar.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";
import { Colors } from '../constants/Colors';
import axios from 'axios';
import { API_URL } from '../constants/ApiURL';
/*
Component to handle the navbar and its icons
*/
function DiaryNavbar({diaryPage}){
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const navigate = useNavigate();

    //Send log out request to server and clear cookies and redirect to login page
    function logoutUser(){
      
        axios.get(process.env.REACT_APP_API_URL + 'user/logout', {withCredentials: true, credentials: "include", headers: {
            'Content-Type': 'application/json',
        },}).then((res) => {
            //If logged out successful navigate back to login page
            if(res.data.loggedOut){
                navigate('/login')
            }
        })
        .catch((err)=>{
            console.error(err)
        })
    }
   
    return( 
        <nav className="navbar navbar-expand-lg navbar-light " style={{backgroundColor: Colors.navbar}}>
            <div className="container-fluid d-flex">
                {diaryPage ?
                <IconButton size='large' edge='start' color='primary' aria-label='logo' onClick={()=> setIsDrawerOpen(true)} style={{marginLeft: '10px'}}>
                    <MenuIcon/>
                </IconButton> :
                <IconButton size='large' edge='start' color='primary' aria-label='logo' onClick={()=> navigate(-1)}>
                    <ArrowBackIcon/>
                </IconButton> 
                }
                {/* PUT COMPANY LOGO HERE*/}
                <div className="links" id="navbarSupportedContent">
                    <form className="links">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            {diaryPage &&
                            <>
                                <li class="nav-item">
                                    <a class="nav-link text-light " href="/feedback">Feedback</a>
                                </li>
                                <li class="nav-item mt-1">
                                    <Button type='button' size='sm' onClick={logoutUser}>
                                        Log Out 
                                    </Button> 
                                </li>
                            </>
                            }
                            
                        </ul>
                    </form>
                </div>
            </div>
            {
                diaryPage && <SideDrawer setIsDrawerOpen={setIsDrawerOpen} isDrawerOpen={isDrawerOpen}/>
            }
            
        </nav>

    )
}

export default DiaryNavbar;
