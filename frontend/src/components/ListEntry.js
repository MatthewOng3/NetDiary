import '../styles/Button.css'
import '../styles/ListEntry.css'

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Tooltip } from '@mui/material';
import LoadingSpinner from './utils/LoadingSpinner';
import ClusterEntry from './ClusterEntry';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RandomId } from "../util/RandomId";

//Redux store
import { useDispatch, useSelector } from 'react-redux';
import { deleteEntry } from '../store/categorySlice';
import { useEffect, useState } from 'react';
import DeleteVerificationModal from './DeleteVerificationModal';

import { getClusterReducerStatus, selectClusterById, fetchClusterEntries } from '../store/clusterSlice';

import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { setNormalEntryDetails, updateDeleteModalState, updateEntryModalState, getDeleteModalOpenState } from '../store/modalSlice';


/**
 * @description Component that handles each individual webpage entry, allow users to click on it, edit or delete it
 * @param allowEdit True if user's dashboard, false if it's a shared category component
 * @param editEntry Function passed in through category comp to 
 * @param canAddCluster Boolean value to indicate if the list entry will show the add button to add to cluster
 * @param createListEntry Function to open entry modal from category comp
 * @see CategoryComp
 */
function ListEntry({ text_description, link, entryId, catId, editEntry, allowEdit, canAddCluster, addToCluster, editClusterEntry }) {

    const dispatch = useDispatch()
    const collectionId = useSelector((store) => store.collection.currentCollection)
    //const [deleteVerificationModal, setDeleteVerificationModal] = useState(false) //State for showing delete verification modal
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const isDeleteModalOpen = useSelector(getDeleteModalOpenState)
    //Cluster states
    const clusterStatus = useSelector(getClusterReducerStatus)
    const cluster = useSelector(state => selectClusterById(state, entryId));
    //Retrieve category state
    const categoryState = useSelector((store) => store.category);

    useEffect(() => {
        //If on idle status and current collection id is not undefined, fetch categories from backend
        if (cluster !== null && clusterStatus === 'idle') {
            dispatch(fetchClusterEntries(entryId))
        }
        else if (clusterStatus === 'succeeded') {
            setIsLoading(false)
        }
        else if (clusterStatus === 'loading') {
            setIsLoading(true)
        }
        else if (clusterStatus === 'failed') {
            setIsLoading(false)
        }

    }, [clusterStatus])

    /**
     * @description Open link in a new tab when the entry is clicked
     */
    function goToLink() {
        window.open(link, '_blank').focus();
    }

    /**
     * @description Update list entry by passing entryId into the entry modal
     * @see CategoryComp
     */
    function updateEntry() {
        // editEntry(entryId);
        dispatch(setNormalEntryDetails({ catId: catId, entryId: entryId, categoryState: categoryState }))
        dispatch(updateEntryModalState(true))
    }

    /**
     * @description Delete list entry
     * @see deleteEntry CategorySlice
     */
    function deleteEntryHandler() {
        dispatch(deleteEntry({ entryId: entryId, catId: catId, collectionId: collectionId }));
    }

    /*Cancel entry*/
    function closeModal() {
        dispatch(updateDeleteModalState(false))
    }

    function addClusterHandler() {
        addToCluster(entryId)
    }


    const decoratedOnClick = useAccordionButton("0", () => {
        setIsOpen((prev) => !prev)
    }
    );

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <Accordion defaultActiveKey="0" >
                <div className="w-76  rounded-md " style={{ marginBottom: '10px', backgroundColor: '#194861' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        {cluster &&
                            <IconButton size='medium' edge='start' color='default' onClick={decoratedOnClick} disableRipple>
                                <ChevronRightIcon sx={{ transform: isOpen ? 'rotate(90deg)' : 'initial' }} />
                            </IconButton>}
                        <Button size='large' style={{ backgroundColor: '#194861', width: '74%', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start', flexDirection: 'row' }} onClick={goToLink}>
                            <div className="flex-1">
                                <text className='page-name'>{text_description}</text>
                            </div>
                        </Button>
                        {allowEdit && (
                            <div className='p-1 flex flex-row justify-evenly'>
                                {canAddCluster &&
                                    <Tooltip title="Add to cluster">
                                        <IconButton size='large' className="icon-btn" onClick={addClusterHandler} sx={{ color: 'black' }}>
                                            <LibraryAddIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip title="Edit entry">
                                    <IconButton size='large' color='primary' className="icon-btn" onClick={updateEntry} style={{ color: 'black' }}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete entry">
                                    <IconButton size='large' edge='start' color='error' sx={{ borderRadius: '6px' }} className="icon-btn" onClick={() => { dispatch(updateDeleteModalState(true)) }} >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )}

                    </div>
                </div>
                <Accordion.Collapse eventKey="0">
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {
                            isOpen && cluster.map((value, index) => (
                                <ClusterEntry key={RandomId() + index} clusterDesc={value.name} allowEdit={true} link={value.link} clusterId={entryId} clusterEntryId={value.clusterEntryId} editEntry={editClusterEntry} />
                            ))
                        }
                    </div>
                </Accordion.Collapse>
            </Accordion>
            {
                isDeleteModalOpen &&
                <DeleteVerificationModal message={"list entry"} onCancel={closeModal} onConfirm={deleteEntryHandler} modalState={isDeleteModalOpen} />
            }
        </>
    )
}

export default ListEntry;