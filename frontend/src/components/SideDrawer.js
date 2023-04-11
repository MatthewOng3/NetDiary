import '../styles/Drawer.css'
import CollectionItem from './CollectionItem';
import { Drawer, Box, Typography, IconButton} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { Colors } from '../constants/Colors';
import LoadingSpinner from './utils/LoadingSpinner'
import {MAX_COLLECTIONS }from '../constants/Limits' 

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addCollection, getAllCollections, getCollectionsError, getCollectionsStatus, fetchCollections } from '../store/collectionSlice';
import { RandomId } from '../util/RandomId';
 

/*
Component to handle the opening and closing of side drawer as well as creating each diary collection
*/
function SideDrawer({setIsDrawerOpen, isDrawerOpen}){
   
    const dispatch = useDispatch(); 
    const [isLoading, setIsLoading] = useState(false) //State to set loading spinner
    const [collectionAmount, setCollectionAmount] = useState(0) //State to keep track of amount of collections and disable accordingly

    // const collectionList = useSelector((store) => store.collection) //Retrieve default collection which is the first item
    const collectionListStatus = useSelector(getCollectionsStatus)
    const collectionList = useSelector(getAllCollections)
    const error = useSelector(getCollectionsError)
    
    //Everytime the status is in idle, fetch most recent collections from database
    useEffect(()=>{
        //return a cleanup function that calls abort on the controller, which will cancel any outstanding requests when the component unmounts or the dependencies change.
        // const abortController = new AbortController(); 
        // { signal: abortController.signal } //Signal to the fetch operation to abort if component unmounts or dependancies change
        if(collectionListStatus === 'idle'){
            dispatch(fetchCollections()); 
        }
        else if(collectionListStatus === 'succeeded'){
            setIsLoading(false)
        }
        else if(collectionListStatus === 'loading'){
            setIsLoading(true)
        }
        else if(collectionListStatus === 'failed'){
            setIsLoading(false)
            alert(error)
        }
        // return () => {
        //     abortController.abort();
        // };
    },[collectionListStatus])
    
    //Executes to update the collection amount each time
    useEffect(()=>{
        setCollectionAmount(collectionList.length)
    },[collectionList])

    //Add new collection handler 
    function addNewCollection(){
        dispatch(addCollection())
    }
    
    return(
        <> 
            <Drawer anchor='left' open={isDrawerOpen} onClose={()=> setIsDrawerOpen(false)}>
                <Box p={2} width='290px' textAlign='center' role='presentation' style={{backgroundColor: Colors.charcoal, display: 'flex', width: '100%' }}>
                    <Typography variant='h6' component='div' style={{marginLeft: '87px', color: 'white'}}>
                        Diary List
                    </Typography>
                    <span style={{position: 'absolute', right: '20px', top: '12px'}}>
                        <IconButton size='medium' edge='start' color='primary' aria-label='add collection' onClick={addNewCollection} disabled={collectionAmount >= MAX_COLLECTIONS}>
                            <AddIcon/>
                        </IconButton>
                    </span>
                </Box>
                <div className='drawer-body' style={{backgroundColor: Colors.charcoal}}>
                    {isLoading && <LoadingSpinner/>}
                    {/*Display collection list if async get method is successful*/}
                    {(
                        collectionList.map((item) => (
                            <CollectionItem name={item.name} collectionId={item.collectionId} key={RandomId()} /> 
                        ))
                    )}
                </div>
            </Drawer>
        </>
    )
}

export default SideDrawer;

