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
function CollectionItem({name, collectionId, showDeleteVerificationModal}) {
  const dispatch = useDispatch(); //Dispatch an action to store  
  const [collectionName, setCollectionName] = useState(name) //State to handle name of collection
  
  //Mainly for the conditional opacity style
  const currentCollectionId = useSelector((store) => store.collection.currentCollection)
  
  //Show delete verification modal and calls delete collection function in sidedrawer
  function deleteHandler(event){
    showDeleteVerificationModal(collectionId)
    event.stopPropagation()
    event.preventDefault()
  }
  
  //Handles name update of collections
  function updateNameHandler(event){
    event.stopPropagation();  
    event.preventDefault();
  
    dispatch(updateCollectionName({collectionId: collectionId, name: collectionName}))
  }
  
  //Displays the categories based on collection clicked
  function displayCategoriesHandler(){
    //update current collection id
    dispatch(updateCurrentCollection(collectionId))
    //Fetch categories
    dispatch(fetchCategories(collectionId))
  }

  return (
    <>
      <div
        className="container mt-3 rounded-full"
        style={{ opacity: currentCollectionId === collectionId ? "1" : "0.5" }}
      >
        <div
          onClick={displayCategoriesHandler}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#3f3c3c",
            borderRadius: "18px",
            padding: "6px 12px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            "&:hover": { backgroundColor: "#5a5757" },
          }}
        >
            <div style={{ width: "48%" }}>
              <input
                placeholder="Diary Name"
                id="input"
                className="input-container"
                autoComplete="off"
                value={collectionName}
                onChange={(event) => {
                  setCollectionName(event.target.value);
                }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
            </div>
            <div className=' flex w-14 justify-between '>
              <Tooltip title="Save collection name">
                <IconButton size='small' edge='start' color='green' aria-label='Save collection name'  onClick={updateNameHandler}>
                  <SaveIcon fontSize='medium' sx={{color: '#979493', marginRight: '2px'}} title="Save Collection Name"/>
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
         
      </div>
    </>
  );
}


export default CollectionItem;