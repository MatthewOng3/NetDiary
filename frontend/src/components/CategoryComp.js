import '../styles/CategoryComponent.css'
import '../styles/Scrollbar.css'
import { Col } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton } from '@mui/material';
import ListEntry from './ListEntry';
import { useEffect, useState } from 'react';

import { Fade, Modal } from '@mui/material';
import EntryModal from "./EntryModal";
import { RandomId } from '../util/RandomId';
import ShareIcon from '@mui/icons-material/Share';

//Redux functions
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, updateCatName } from '../store/categorySlice';
import DeleteVerificationModal from './DeleteVerificationModal';
import ErrorModal from './utils/ErrorModal';
import { getShareToken } from '../store/userSlice';
 

/*Each category card component*/
function CategoryComp({name, listEntries, catId, collectionId}){
  const dispatch = useDispatch();
  const [colValue, setColValue] = useState(3) //State to set dimensions
  const [showModal, setShowModal] = useState(false) //Show ListEntry state
  const [catName, setCatName] = useState(name) //State to keep track of the category's name
  const [clickedEntryId, setClickedEntryId] = useState('') //State to keep track of which entry clicked to open the modal
  const [deleteVerificationModal, setDeleteVerificationModal] = useState(false) //State for showing delete verification modal
  const [error, setError] = useState()
 

  //State to keep track of window size
  const [windowDimension, detectWD] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight
  })

  //Callback function called for event listener, setting the new dimensions
  const detectSize = () => {
      detectWD({  
          winWidth: window.innerWidth,
          winHeight: window.innerHeight
      })
  }

  //Calls this function everytime window dimension value changes
  useEffect(()=>{
      window.addEventListener('resize', detectSize)
      
      return () => {
          window.removeEventListener('resize', detectSize);
      }
  },[windowDimension])

  //Use effect hook to change value of col for diff window dimensions
  useEffect(()=>{
    if(767 <= windowDimension.winWidth && windowDimension.winWidth<= 1225){
      setColValue(7)
    }
    else if( windowDimension.winWidth <= 775){
      setColValue(12)
    }
    else{
      setColValue(3)
    }
  },[windowDimension.winWidth, colValue])

  
  /*Change catName state*/
  function updateName(event){
    setCatName(event.target.value)
  }

  /*Updates the category name*/
  function updateCategoryName(){
    dispatch(updateCatName({catId: catId, name: catName, collectionId: collectionId}))
  }
  
  /*Delete category handler*/
  function deleteCategoryHandler(){
    setDeleteVerificationModal(false)
    dispatch(deleteCategory({collectionId: collectionId, catId: catId}))
  }
  
  /**
   * Show delete verification modal to verify if user wants to delete category
   */
  function showDeleteVerificationModal(){
    setDeleteVerificationModal(true)
  }

  /**
   * Show modal that creates a new list entry
   */
  function createListEntry(){
    setClickedEntryId(undefined)
    setShowModal(true)
  }

  /*Handles updating the list entry so pass in current entry id, function passed into ListEntry*/
  function updateListEntry(entryId){
    setClickedEntryId(entryId)
    setShowModal(true)
  }

  /*Cancel entry*/
  function closeEntry(){
    setShowModal(false)
    setDeleteVerificationModal(false)
  }
  
  /*Cancel entry*/
  function closeErrorModal(){
    setError(undefined)
  }
  
  /*Allow users to share either by link or native apps*/
  async function shareCategory(){
    const shareToken = localStorage.getItem("shareToken")
    const url = `${process.env.REACT_APP_API_URL}share/getCategory/${shareToken}/${collectionId}/${catId}`
    
    //Create sharing data object
    const shareData = {
      title: name,
      url: url,
    };

    ///Check if data is shareable
    const canShare = navigator.canShare(shareData)

    //Trigger native share api
    if(canShare){
      try{
        await navigator.share(shareData)
      }
      catch(err){
        setError(err)
      }
    }
  }

  return(
    <>
      <Col md={colValue} className='col' style={{marginBottom: '30px',}}>
          <div className="card" style={{height: '100%', boxShadow: '2px 2px #1c1c20', boxSizing: 'border-box', borderWidth: '0', borderRadius: '9px', width: '100%' }} >
            <div className="card-header "  style={{backgroundColor: '#2c2c31', width: '100%', borderBottom: 'none', }}>
              <div style={{width: '60%', padding: '6px'}}>
                <input autoComplete='off' placeholder='Enter Name of Category' className='input-container' value={catName} onChange={updateName} onBlur={updateCategoryName}/>
              </div>
              <div className='justify-end'>
                <IconButton size='medium' edge='start' color='primary' aria-label='add collection' onClick={createListEntry}>
                    <AddIcon/>
                </IconButton>
                <IconButton size='medium' edge='start' color='warning' aria-label='add collection' style={{marginLeft: '3px'}} onClick={showDeleteVerificationModal}>
                    <DeleteOutlineIcon/>
                </IconButton>
                <IconButton size='medium' edge='start' color='warning' aria-label='add collection' style={{marginLeft: '3px'}} onClick={shareCategory}>
                    <ShareIcon/>
                </IconButton>
              </div>
            </div>
            <div className='scroll-container'>
              <div className="card-body scrollbar" id='scrollbar1'>
                {
                  listEntries.map((value,index)=>(
                    <ListEntry key={RandomId() + index} text_description={value.name} link={value.link} entryId={value.entryId} catId={catId} editEntry={updateListEntry}/>
                  ))
                }
              </div>
            </div>
          </div>
      </Col>
      <ErrorModal isOpen={error} onClose={closeErrorModal}>{error}</ErrorModal>
      {showModal && 
        <Modal open={showModal} >
            <Fade in={showModal}>
                <div className= "flex h-full justify-center" style={{alignItems: 'center'}}>
                    <EntryModal closeModal={closeEntry} catId={catId} entryId={clickedEntryId}/>
                </div>
            </Fade>
        </Modal>
      }
      {
        deleteVerificationModal && <DeleteVerificationModal message={"Category"} onCancel={closeEntry} onConfirm={deleteCategoryHandler} modalState={deleteVerificationModal}/>
      }
    </>
  )
}

export default CategoryComp;