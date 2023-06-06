import '../styles/Button.css'
import '../styles/ListEntry.css'

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
 

//Redux store
import { useDispatch, useSelector } from 'react-redux';
import { deleteEntry } from '../store/categorySlice';
import { useState } from 'react';
import DeleteVerificationModal from './DeleteVerificationModal';


import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Collapsible from './Collapsible';

/**
 * @description Component that handles each individual webpage entry, allow users to click on it, edit or delete it
 * @param allowEdit True if user's dashboard, false if it's a shared category component
 * @author Matt
 */
function ListEntry({text_description, link, entryId, catId, editEntry, allowEdit}){
    
    const dispatch = useDispatch()
    const collectionId = useSelector((store) => store.collection.currentCollection)
    const [deleteVerificationModal, setDeleteVerificationModal] = useState(false) //State for showing delete verification modal
    const [openCluster, setOpenCluster] = useState(false)

    //Open link in a new tab when link is clicked
    function goToLink(){
        window.open(link, '_blank').focus();
    }

    /**
     * @description Update list entry by passing entryId into the entry modal
     * @see editEntry
     */
    function updateEntry(){
        editEntry(entryId)
    }

    /**
     * @description Delete list entry
     * @see deleteEntry CategorySlice
     */
    function deleteEntryHandler(){
        dispatch(deleteEntry({entryId: entryId, catId: catId, collectionId: collectionId}))
    }

    /*Cancel entry*/
    function closeModal(){
        setDeleteVerificationModal(false)
    }
    
    /**
     * @description Open dropdown list of possible clusters, set open state to true
     * @param event click event
     */
    function openDropDown(event){
        event.stopPropagation();
        event.preventDefault();
        setOpenCluster(!openCluster)
    }

    return(
        <>
            <div className="w-76  rounded-md"style={{ marginBottom: '10px',backgroundColor: '#194861'}}>          
                <div className='flex flex-row '>
                    <Button size='large' style={{backgroundColor: '#194861', width: '74%', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start', flexDirection: 'row'}} onClick={goToLink}>
                        <Collapsible />
                        <div className="flex-1">
                            <text className='page-name'>{text_description}</text>   
                        </div>
                    </Button>
                    {allowEdit && (
                        <div className='p-1 flex flex-row justify-evenly'>
                            <IconButton size='large' color='primary' sx={{marginRight: '14px',   borderRadius: '6px'}} className="icon-btn" onClick={updateEntry} style={{color: 'white'}}>
                                <EditIcon/>
                            </IconButton>
                            <IconButton size='large' edge='start' color='error'  sx={{ borderRadius: '6px'}} className="icon-btn" onClick={()=>{setDeleteVerificationModal(true)}} >
                                <DeleteIcon/>
                            </IconButton>
                        </div>
                    )}
                </div>    
            </div>
            {
                deleteVerificationModal &&
                <DeleteVerificationModal message={"list entry"} onCancel={closeModal} onConfirm={deleteEntryHandler} modalState={deleteVerificationModal}/>
            }
        </>
    )
}

export default ListEntry;