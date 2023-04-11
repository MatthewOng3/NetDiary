import { useState } from 'react';
import '../styles/CollectionItem.css'

//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { Button, IconButton, Tooltip } from '@mui/material';


import { useDispatch, useSelector } from 'react-redux'
import { deleteCollection, updateCollectionName, updateCurrentCollection} from '../store/collectionSlice'
import { fetchCategories } from '../store/categorySlice';

/*
Component that allows user to create, choose, delete diary collections
*/
function CollectionItem({name, collectionId}) {
  const dispatch = useDispatch(); //Dispatch an action to store  
  const [collectionName, setCollectionName] = useState(name) //State to handle name of collection

  //Mainly for the conditional opacity style
  const currentCollectionId = useSelector((store) => store.collection.currentCollection)

  //Handles the deleting of collections 
  function deleteHandler(){
    dispatch(deleteCollection(collectionId))
  }
  
  //Handles name update of collections
  function updateNameHandler(event){
    event.stopPropagation();  
    dispatch(updateCollectionName({collectionId: collectionId, name: collectionName}))
    
  }
  
  //Displays the categories based on collection clicked
  function displayCategoriesHandler(){
    //Fetch categories
    dispatch(fetchCategories(collectionId))
    //update current collection id
    dispatch(updateCurrentCollection(collectionId))
     
  }
  
  return (
    <div className='container mt-3 rounded-full  ' style={{opacity: currentCollectionId === collectionId ? "1" : "0.5"}}>
        <Button variant='contained' size='large' sx={{backgroundColor: '#3f3c3c', borderRadius: '18px', '&:hover': {backgroundColor: '#5a5757'}}} disableRipple onClick={displayCategoriesHandler}>
          <div  style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <div  style={{width: '38%'}}> 
              <input placeholder='Diary Name' id='input' className='input-container' autoComplete='off'  value={collectionName} onChange={(event)=>{
                setCollectionName(event.target.value)
              }} onClick={(event) => {event.stopPropagation()}}/>
            </div>
            <div className=' flex w-14 justify-between '>
              <Tooltip title="Save collection name">
                <IconButton size='small' edge='start' color='green' aria-label='Save collection name'  onClick={updateNameHandler}>
                  <SaveIcon fontSize='medium' sx={{color: '#128d12', marginRight: '2px'}} title="Save Collection Name"/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete collection">
                <IconButton size='small' edge='start' color='red' aria-label='delete collection'  onClick={deleteHandler} sx={{'&:hover': {backgroundColor: '#223138'}}}
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}>
                  <DeleteOutlinedIcon fontSize='medium' sx={{color: '#c71b1b', marginLeft: '2px'}}/>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Button>
    </div>
  );
}


export default CollectionItem;