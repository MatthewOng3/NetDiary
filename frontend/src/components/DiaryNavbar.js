import { IconButton } from '@mui/material'


import { Button } from 'react-bootstrap';
import '../styles/DiaryNavbar.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { Colors } from '../constants/Colors';
import { useDispatch } from "react-redux";
import { logout } from '../store/userSlice';
import { resetCategory } from '../store/categorySlice';
import { resetCollection } from '../store/collectionSlice';
import { resetCluster } from '../store/clusterSlice';
import api from '../util/api';


/**
 * @description Component to handle the navbar and its icons 
 */
function DiaryNavbar({ diaryPage }) {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    //Send log out request to server and clear cookies and redirect to login page
    function logoutUser() {

        api.get('user/logout', {
            withCredentials: true, credentials: "include", headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            //If logged out successful navigate back to login page
            if (res.data.loggedOut) {
                //Clear all local storage data
                localStorage.removeItem("share-token")
                //Reset all local states
                dispatch(resetCategory())
                dispatch(resetCollection())
                dispatch(resetCluster())
                dispatch(logout())
                navigate('/login')
            }
        })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light " style={{ backgroundColor: Colors.navbar }}>
            <div className="container-fluid justify-end flex-auto">
                {!diaryPage &&
                    <IconButton IconButton size='large' edge='start' color='primary' aria-label='logo' onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                }
                {/* PUT COMPANY LOGO HERE*/}
                <div className="links flex-auto justify-end" id="navbarSupportedContent">
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
            {/* {
                diaryPage && <SideDrawer setIsDrawerOpen={setIsDrawerOpen} isDrawerOpen={isDrawerOpen} />
            } */}

        </nav >

    )
}

export default DiaryNavbar;
