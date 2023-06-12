import '../styles/EntryModal.css'
import { Form } from "react-bootstrap";
import { useEffect, useState } from 'react';

import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TurnedInIcon from '@mui/icons-material/TurnedIn';

//Redux functions
import { saveEntry } from '../store/categorySlice';
import { saveClusterEntry, getClusterAddState } from '../store/clusterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getClickedClusterEntryId, getClickedEntryId, getEntryModalDetails } from '../store/modalSlice';


/**
 * @description Entry modal that appears when users edit or create a new list entry
 * @param closeModal Function passed in to close modal
 * @param clusterEdit Boolean value to indicated if it's a cluster edit or normal entry edit
 * @path /user/net-diary
 * @see CategoryComp
 */
function EntryModal({ closeModal, catId }) {

    //States to keep track of the input by user
    const [enteredDescription, setEnteredDescription] = useState('')
    const [enteredLink, setEnteredLink] = useState('')
    const [validated, setValidated] = useState(false);
    const dispatch = useDispatch()

    //Get current collection id
    const collectionId = useSelector((store) => store.collection.currentCollection)
    //Get cluster add status
    const isClusterAdd = useSelector(getClusterAddState)
    //Get entry details for entry modal
    const entryDetails = useSelector(getEntryModalDetails);
    //Get clicked entry id
    const clickedEntryId = useSelector(getClickedEntryId)
    //Get clicked cluster entry Id
    const clickedClusterEntryId = useSelector(getClickedClusterEntryId)

    useEffect(() => {
        setEnteredDescription(entryDetails.name)
        setEnteredLink(entryDetails.link)
    }, [entryDetails])


    /**
     * @description Save list entry, both regular and cluster entry dispatches actions to category and cluster slice
     * @path /user/net-diary
     * @see CategorySlice
     * @see ClusterSlice
     */
    function saveListEntry() {

        setValidated(false)
        //Cluster add
        if (isClusterAdd) {
            dispatch(saveClusterEntry({ description: enteredDescription, link: enteredLink, entryId: clickedEntryId, clusterEntryId: clickedClusterEntryId }))
        }
        //Regular list entry add
        else {
            //Save entry to database
            dispatch(saveEntry({ description: enteredDescription, link: enteredLink, catId: catId, entryId: clickedEntryId, collectionId: collectionId }))
        }

        closeModal();
    }


    return (
        <div className="popup-container">
            <div className=" bg-slate-700 form-container ">
                <div style={{ justifyContent: 'flex-end', flexDirection: 'row', display: 'flex' }}>
                    <IconButton size='medium' color='default' sx={{ backgroundColor: 'transparent' }} onClick={closeModal}>
                        <CloseIcon size="large" />
                    </IconButton>
                </div>
                <Form.Group className="mb-2 form-group">
                    <Form.Label className="text-light">Description</Form.Label>
                    <Form.Control
                        name="description"
                        required
                        type="text"
                        placeholder="Enter short description of webpage"
                        value={enteredDescription}
                        onChange={(event) => { setEnteredDescription(event.target.value) }}
                    />
                </Form.Group>
                <Form.Group className="mb-2 form-group">
                    <Form.Label className="text-light">Link</Form.Label>
                    <Form.Control
                        name="Link"
                        required
                        type="text"
                        placeholder="Place URL of webpage here"
                        value={enteredLink}
                        onChange={(event) => { setEnteredLink(event.target.value) }}
                        isInvalid={validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        Unsafe Url detected
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="mt-3" style={{ justifyContent: 'space-evenly', display: 'flex' }}>
                    <button
                        className="px-8 py-2 rounded-3xl text-orange-400 hover:text-white  border-2 border-orange-500 hover:bg-orange-600" onClick={saveListEntry}
                        disabled={!enteredLink || !enteredDescription}
                    >
                        Save
                        <TurnedInIcon className='ml-1' />
                    </button>
                    <button
                        className="px-8 py-2 rounded-3xl text-orange-400 hover:text-white  border-2 border-orange-500 hover:bg-orange-600" onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EntryModal;

