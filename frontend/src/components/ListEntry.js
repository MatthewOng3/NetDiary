import '../styles/Button.css'
import '../styles/ListEntry.css'

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {Col} from 'react-bootstrap'
import axios from 'axios'

//Redux store
import { useDispatch, useSelector } from 'react-redux';
import { deleteEntry } from '../store/categorySlice';
import { useEffect, useState } from 'react';
import DeleteVerificationModal from './DeleteVerificationModal';

/*Component that handles each individual webpage entry, controls the button itself and icon buttons*/
function ListEntry({text_description, link, entryId, catId, editEntry}){
    // const [faviconUrl, setFaviconUrl] = useState('');
    const dispatch = useDispatch()
    const collectionId = useSelector((store) => store.collection.currentCollection)
    const [deleteVerificationModal, setDeleteVerificationModal] = useState(false) //State for showing delete verification modal

    // useEffect(()=>{
    //     const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
    //     axios.get(`${corsAnywhereUrl}https://www.google.com/s2/favicons?domain=${link}`).then((res)=>{
    //         // setFaviconUrl(res.icons[0].src)
    //         console.log(res)
    //     })
    //     .catch((err)=>{console.log(err)})
    // },[])

    //Open link in a new tab when link is clicked
    function goToLink(){
        window.open(link, '_blank').focus();
    }

    //Edit list entry by passing entryId into entry modal 
    function updateEntry(){
        editEntry(entryId)
    }

    //Delete list entry
    function deleteEntryHandler(){
        dispatch(deleteEntry({entryId: entryId, catId: catId, collectionId: collectionId}))
    }

     /*Cancel entry*/
    function closeModal(){
        setDeleteVerificationModal(false)
    }
    console.log(deleteVerificationModal)
    return(
        <>
            <div className="w-76  rounded-md"style={{ marginBottom: '10px',backgroundColor: '#5d1669'}}>          
                <div className='flex flex-row justify-between'>
                    <Button size='large' style={{backgroundColor: '#5d1669', width: '74%', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start'}} onClick={goToLink} >
                        <Col md={8} className="flex ">
                            {/* <img src={} alt="" /> */}
                            <text className='page-name py-1' >{text_description}</text>
                        </Col>
                    </Button>
                    <div className='p-1 flex flex-row justify-evenly'>
                        <IconButton size='large' color='primary' sx={{marginRight: '14px',   borderRadius: '6px'}} className="icon-btn" onClick={updateEntry} style={{color: 'white'}}>
                            <EditIcon/>
                        </IconButton>
                        <IconButton size='large' edge='start' color='error'  sx={{ borderRadius: '6px'}} className="icon-btn" onClick={()=>{setDeleteVerificationModal(true)}} >
                            <DeleteIcon/>
                        </IconButton>
                    </div>
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