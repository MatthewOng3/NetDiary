//Components
import DiaryNavbar from "../../components/DiaryNavbar";
import Button from "../../components/utils/Button";
import CategoryComp from "../../components/CategoryComp";
import LoadingSpinner from '../../components/utils/LoadingSpinner'
import React from "react";
import {API_URL} from '../../constants/ApiURL'
import axios from 'axios'
//Styling
import { Colors } from "../../constants/Colors";
import '../../styles/DiaryPage.css'
import { Container, Row} from "react-bootstrap";
import { useRef, useEffect, useState } from "react";
import '../../styles/Scrollbar.css'

//Redux store stuff
import { useSelector, useDispatch } from "react-redux";
import { addCategory, getAllCategory, getCategoryError, getCategoryStatus,  fetchCategories } from '../../store/categorySlice';
import { MAX_CATEGORIES } from "../../constants/Limits";
import { getCollectionsStatus, updateCurrentCollection } from "../../store/collectionSlice";

/*Component that displays the main diary page*/
function DiaryPage(){
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    //Retrieve category list state and size
    const categoryList = useSelector(getAllCategory)
    //Retrieve status of state
    const categoryListStatus = useSelector(getCategoryStatus)
    const collectionListStatus = useSelector(getCollectionsStatus)
    const currentCollectionId = useSelector((store) => store.collection.currentCollection)
    //Retrieve error
    const error = useSelector(getCategoryError)

    //Everytime component gets mounted, send request to server and retrieve collectionId from http cookie
    useEffect(()=>{
        axios.get(API_URL + 'collection/retrieveCollectionId',  {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            credentials: "include"
        }).then((response) => {
            dispatch(updateCurrentCollection(response.data.collectionId))
        })
        .catch((err)=>{ })
    },[])
    
    
    //Everytime the status is in idle, fetch most recent collections from database
    useEffect(()=>{
        //return a cleanup function that calls abort on the controller, which will cancel any outstanding requests when the component unmounts or the dependencies change.
        const abortController = new AbortController(); 
        const {signal} = abortController //Signal to the fetch operation to abort if component unmounts or dependancies change
        
        //If on idle status and current collection id is not undefined, fetch categories from backend
        if((categoryListStatus === 'idle' || collectionListStatus === 'idle') && currentCollectionId){
            dispatch(fetchCategories(currentCollectionId, {signal})); 
        }
        else if(categoryListStatus === 'succeeded'){
            setIsLoading(false) 
        }
        else if(categoryListStatus === 'loading'){
            setIsLoading(true)
        }
        else if(categoryListStatus === 'failed'){
            setIsLoading(false)
            alert(error)
        }
        return () => {
            abortController.abort();
        };
        
    },[currentCollectionId, categoryListStatus])
    
    /*Add a new category block*/
    function addNewCategory(){
        dispatch(addCategory(currentCollectionId))
    }
     
    return(
        <>
            <DiaryNavbar diaryPage={true}/>
            <div style={{backgroundColor: Colors.dark_grey200, width: '100%', height:'100vh', overflow: 'scroll', scrollBehavior:'smooth', paddingBottom: '2%'}} >   
                <div className="new-category mb-4" style={{backgroundColor: Colors.dark_grey200}}>
                    <Button width='150px' height='45px' onClick={addNewCategory} color={'#FB8C00'} disabled={categoryList.length >= MAX_CATEGORIES}>New Category</Button>
                </div>
                <Container fluid style={{backgroundColor: Colors.dark_grey200, paddingLeft: '0%'}} >
                    <Row className="flex justify-evenly ">
                        {isLoading && <LoadingSpinner/>}
                        {categoryList.map((item,index)=>{
                            return(
                                <React.Fragment key={`cat-${item.catId}`}>
                                    <CategoryComp key={item.catId} name={item.name} listEntries={item.listEntries} catId={item.catId} collectionId={currentCollectionId}/>
                                </React.Fragment>
                            )          
                        })} 
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default DiaryPage;