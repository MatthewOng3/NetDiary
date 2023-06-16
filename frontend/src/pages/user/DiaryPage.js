//Components
import DiaryNavbar from "../../components/DiaryNavbar";
import OwnButton from "../../components/utils/OwnButton";
import CategoryComp from "../../components/CategoryComp";
import LoadingSpinner from '../../components/utils/LoadingSpinner'
import React from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

//Styling
import { Colors } from "../../constants/Colors";
import '../../styles/DiaryPage.css'
import { Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import '../../styles/Scrollbar.css'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';

//Redux store stuff
import { useSelector, useDispatch } from "react-redux";
import { getUserStatus, verifyLoggedIn } from "../../store/userSlice";
import { addCategory, getAllCategory, getCategoryError, getCategoryStatus, fetchCategories } from '../../store/categorySlice';
import { MAX_CATEGORIES } from "../../constants/Limits";
import { getCollectionsStatus, updateCurrentCollection } from "../../store/collectionSlice";
import { fetchAllClusters } from "../../store/clusterSlice";
import api from "../../util/api";

/**
 * @description Page that allows users to store webpages, main dashboard page essentially
 * @author Matt
 * @path /user/net-diary
 */
function DiaryPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const isLoggedIn = useSelector((store) => store.user.loggedIn)
    const loginStatus = useSelector(getUserStatus)
    const [openPopup, setOpenPopup] = useState(false)
    //Retrieve category list state and size
    const categoryList = useSelector(getAllCategory)

    //Retrieve status of state
    const categoryListStatus = useSelector(getCategoryStatus)
    const collectionListStatus = useSelector(getCollectionsStatus)
    const currentCollectionId = useSelector((store) => store.collection.currentCollection)


    //Retrieve error
    const error = useSelector(getCategoryError)

    //Check if first time logging in and display popup about enabling popups and redirects in user browser settings
    useEffect(() => {
        if (!localStorage.getItem("Popup")) {
            setOpenPopup(true)
        }
    }, [])

    //Once component first loads verify if user has an ongoing session
    useEffect(() => {
        dispatch(verifyLoggedIn())
    }, [isLoggedIn])


    //Hook to send user back to login page if the verification fails
    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(false)
        }
        else if (loginStatus === 'loading') {
            setIsLoading(true)
        }
        else if (loginStatus === 'failed') {
            navigate('/login')
            setIsLoading(false)
        }
    }, [isLoggedIn, loginStatus])


    //Everytime isLoggedIn changes, send request to server and retrieve collectionId from httpOnly cookie
    useEffect(() => {
        if (isLoggedIn) {
            api.get('collection/retrieveCollectionId', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
                credentials: "include"
            }).then((response) => {
                dispatch(updateCurrentCollection(response.data.collectionId))
            })
                .catch((err) => { console.log(error) })
        }
    }, [isLoggedIn])



    //Everytime the status is in idle, fetch most recent collections from database
    useEffect(() => {
        //return a cleanup function that calls abort on the controller, which will cancel any outstanding requests when the component unmounts or the dependencies change.
        const abortController = new AbortController();
        const { signal } = abortController //Signal to the fetch operation to abort if component unmounts or dependancies change

        //If on idle status and current collection id is not undefined, fetch categories from backend
        if ((categoryListStatus === 'idle' || collectionListStatus === 'idle') && currentCollectionId) {
            dispatch(fetchCategories(currentCollectionId, { signal }));
        }
        else if (categoryListStatus === 'succeeded') {
            setIsLoading(false)
        }
        else if (categoryListStatus === 'loading') {
            setIsLoading(true)
        }
        else if (categoryListStatus === 'failed') {
            setIsLoading(false)
            alert(error)
        }
        return () => {
            abortController.abort();

        };

    }, [currentCollectionId, categoryListStatus])

    //On first page load fetch all clusters into cluster slice
    useEffect(() => {
        dispatch(fetchAllClusters())
    }, [])

    /**
     * @description Add a new category block, dispatches action with the current collection id
     * @see CategorySlice
     */
    function addNewCategory() {
        dispatch(addCategory(currentCollectionId))
    }

    /**
     * @description Function to close popup and set local storage value so it won't be prompted again
     */
    function handleClose() {
        setOpenPopup(false)
        localStorage.setItem("Popup", true)
    }

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {isLoggedIn && (
                <>
                    <DiaryNavbar diaryPage={true} />
                    <div style={{ backgroundColor: Colors.dark_grey200, width: '100%', height: '100vh', overflow: 'auto', scrollBehavior: 'smooth', paddingBottom: '2%' }} >
                        <div className="new-category mb-4" style={{ backgroundColor: Colors.dark_grey200 }}>
                            {currentCollectionId ? <OwnButton width='150px' height='45px' onClick={addNewCategory} color={'#FB8C00'} disabled={(categoryList.length >= MAX_CATEGORIES)}>
                                <NewspaperIcon sx={{ marginRight: '2px' }} />
                                New Category
                            </OwnButton> : null}
                        </div>
                        <Container fluid style={{ backgroundColor: Colors.dark_grey200, paddingLeft: '0%', }} >
                            <Row className="flex justify-start condition" style={{ paddingLeft: '10px', paddingRight: '0%', }}>
                                {isLoading && <LoadingSpinner />}
                                {categoryList.map((item) => {
                                    return (
                                        <React.Fragment key={`cat-${item.catId}`}>
                                            <CategoryComp key={item.catId} name={item.name} listEntries={item.listEntries} catId={item.catId} collectionId={currentCollectionId} />
                                        </React.Fragment>
                                    )
                                })}
                            </Row>
                            <div>
                                <Dialog
                                    open={openPopup}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleClose}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle>{"Enable browser popups in order to utilise cluster functionality"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                            Enable browser popups in Settings &#x2192; Privacy and security &#x2192; Pop-ups and redirects
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Close</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </Container>
                    </div>
                </>
            )}

        </>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default DiaryPage;