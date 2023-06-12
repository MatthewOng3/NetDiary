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
import { updateClusterAdd } from '../store/clusterSlice';
import DeleteVerificationModal from './DeleteVerificationModal';
import ErrorModal from './utils/ErrorModal';
import { getDeleteModalOpenState, getEntryModalOpenState, resetEntryModalDetails, updateDeleteModalState, updateEntryModalState, setClickedEntryId, setClickedClusterEntryId } from '../store/modalSlice';


/*Each category card component*/
function CategoryComp({ name, listEntries, catId, collectionId }) {
  const dispatch = useDispatch();
  //State to set dimensions
  const [colValue, setColValue] = useState(3)
  const [error, setError] = useState()
  //
  const [catName, setCatName] = useState(name) //State to keep track of the category's name

  const [clusterEdit, setClusterEdit] = useState(false)
  //Modal open states
  const isEntryModalOpen = useSelector(getEntryModalOpenState)
  // const isDeleteModalOpen = useSelector(getDeleteModalOpenState)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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
  useEffect(() => {
    window.addEventListener('resize', detectSize)

    return () => {
      window.removeEventListener('resize', detectSize);
    }
  }, [windowDimension])

  //Use effect hook to change value of col for diff window dimensions
  useEffect(() => {
    if (767 <= windowDimension.winWidth && windowDimension.winWidth <= 1225) {
      setColValue(5)
    }
    else if (windowDimension.winWidth <= 775) {
      setColValue(12)
    }
    else {
      setColValue(3)
    }
  }, [windowDimension.winWidth, colValue])


  /*Change catName state*/
  function updateName(event) {
    setCatName(event.target.value)
  }

  /**
   * @description Update category name
   * @see CategorySlice
   */
  function updateCategoryName() {
    dispatch(updateCatName({ catId: catId, name: catName, collectionId: collectionId }))
  }

  /**
   * @description Delete the category component by sending action to slice and sending a put request to backend
   * @see CategorySlice
   */
  function deleteCategoryHandler() {
    //Close Delete Modal
    dispatch(updateDeleteModalState(false))
    dispatch(deleteCategory({ collectionId: collectionId, catId: catId }))
  }

  /**
   * @description Show delete verification modal to verify if user wants to delete category
   * @see ModalSlice
   */
  function showDeleteVerificationModal() {
    //dispatch(updateDeleteModalState(true))
    setIsDeleteModalOpen(true)
  }

  /**
   * @description Show entry modal that creates a new list entry
   * @see ListEntry
   */
  function createListEntry() {
    //Reset details displayed
    dispatch(resetEntryModalDetails())
    //Set clicked entry id
    dispatch(setClickedEntryId(""))
    dispatch(setClickedClusterEntryId(""))
    //Display entry modal
    dispatch(updateEntryModalState(true))
  }

  /**
   * @description Close the entry either by clicking cancel or x, sets all modal states to false, reset clicked entry id and set cluster add to false
   */
  function closeEntry() {
    dispatch(updateClusterAdd(false))
    setIsDeleteModalOpen(false)
    //dispatch(updateDeleteModalState(false))
    dispatch(updateEntryModalState(false))
    dispatch(setClickedEntryId(""))
    dispatch(setClickedClusterEntryId(""))
    setClusterEdit(false)
  }

  /*Cancel entry*/
  function closeErrorModal() {
    setError(undefined)
  }

  /*Allow users to share either by link or native apps*/
  async function shareCategory() {

    const url = `${process.env.REACT_APP_BASE_URL}shared/${collectionId}/${catId}`

    //Create sharing data object
    const shareData = {
      title: name,
      url: url,
    };

    ///Check if data is shareable
    const canShare = navigator.canShare(shareData)

    //Trigger native share api
    if (canShare) {
      try {
        await navigator.share(shareData)
      }
      catch (err) {
        setError(err)
      }
    }
  }



  return (
    <>
      <Col md={colValue} className='col' style={{ marginBottom: '30px', }}>
        <div className="card" style={{ height: '100%', boxShadow: '2px 2px #1c1c20', boxSizing: 'border-box', borderWidth: '0', borderRadius: '9px', width: '100%' }} >
          <div className="card-header " style={{ backgroundColor: '#2c2c31', width: '100%', borderBottom: 'none' }}>
            <div style={{ width: '60%', padding: '6px' }}>
              <input autoComplete='off' placeholder='Enter Name of Category' className='input-container' value={catName} onChange={updateName} onBlur={updateCategoryName} />
            </div>
            <div className='justify-end'>
              <IconButton size='medium' edge='start' color='primary' aria-label='add collection' onClick={createListEntry}>
                <AddIcon />
              </IconButton>
              <IconButton size='medium' edge='start' color='warning' aria-label='add collection' style={{ marginLeft: '3px' }} onClick={() => setIsDeleteModalOpen(true)}>
                <DeleteOutlineIcon />
              </IconButton>
              <IconButton size='medium' edge='start' color='warning' aria-label='add collection' style={{ marginLeft: '3px' }} onClick={shareCategory}>
                <ShareIcon />
              </IconButton>
            </div>
          </div>
          <div className='scroll-container'>
            <div className="card-body scrollbar" id='scrollbar1'>
              {
                listEntries.map((value, index) => (
                  <ListEntry key={RandomId() + index} text_description={value.name} link={value.link} entryId={value.entryId} catId={catId} allowEdit={true} canAddCluster={true} />
                ))
              }
            </div>
          </div>
        </div>
      </Col>
      <ErrorModal isOpen={error} onClose={closeErrorModal}>{error}</ErrorModal>
      {isEntryModalOpen &&
        <Modal open={isEntryModalOpen}>
          <Fade in={isEntryModalOpen}>
            <div className="flex h-full justify-center" style={{ alignItems: 'center' }}>
              <EntryModal closeModal={closeEntry} catId={catId} clusterEdit={clusterEdit} />
            </div>
          </Fade>
        </Modal>
      }
      {
        isDeleteModalOpen &&
        <Modal open={isDeleteModalOpen}>
          <Fade in={isDeleteModalOpen}>
            <div className="flex h-full justify-center">
              <DeleteVerificationModal message={"category"} onCancel={() => setIsDeleteModalOpen(false)} onConfirm={deleteCategoryHandler} />
            </div>
          </Fade>
        </Modal>
      }
    </>
  )
}

export default CategoryComp;