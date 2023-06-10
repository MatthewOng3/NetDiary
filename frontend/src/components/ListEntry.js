import '../styles/Button.css'
import '../styles/ListEntry.css'

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Tooltip } from '@mui/material';
import LoadingSpinner from './utils/LoadingSpinner';

//Redux store
import { useDispatch, useSelector } from 'react-redux';
import { deleteEntry } from '../store/categorySlice';
import { useEffect, useState } from 'react';
import DeleteVerificationModal from './DeleteVerificationModal';
import Collapsible from './Collapsible';
import axios from 'axios';
import { fetchCluster, getClusterReducerStatus, selectClusterById } from '../store/clusterSlice';

/**
 * @description Component that handles each individual webpage entry, allow users to click on it, edit or delete it
 * @param allowEdit True if user's dashboard, false if it's a shared category component
 * @param editEntry Function passed in through category comp to 
 * @param canAddCluster Boolean value to indicate if the list entry will show the add button to add to cluster
 * @param createListEntry Function to open entry modal from category comp
 * @see CategoryComp
 */
function ListEntry({ text_description, link, entryId, catId, editEntry, allowEdit, canAddCluster, addToCluster }) {

    const dispatch = useDispatch()
    const collectionId = useSelector((store) => store.collection.currentCollection)
    const [deleteVerificationModal, setDeleteVerificationModal] = useState(false) //State for showing delete verification modal
    const [isLoading, setIsLoading] = useState(false)
    //Cluster states
    const [openCluster, setOpenCluster] = useState(false)
    const [haveCluster, setHaveCluster] = useState(true)
    const [clusterEntries, setClusterEntries] = useState([])

    const clusterStatus = useSelector(getClusterReducerStatus)
    const cluster = useSelector(state => selectClusterById(state, entryId));

    useEffect(() => {
        //If on idle status and current collection id is not undefined, fetch categories from backend
        if (cluster !== null && clusterStatus === 'idle') {
            setClusterEntries(cluster)
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

    async function fetchClusterEntries() {

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        };

        const response = await axios.get(process.env.REACT_APP_API_URL + `cluster/retrieve/${entryId}`, axiosConfig)
        if (!response.data.clusterEntries) {
            setClusterEntries(response.data.clusterEntries)
        }
    }

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
        editEntry(entryId);
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
        setDeleteVerificationModal(false);
    }

    /**
     * @description Open dropdown list of possible clusters, set open state to true
     * @param event click event
     */
    function openDropDown(event) {
        event.stopPropagation();
        event.preventDefault();
        setOpenCluster(!openCluster)
    }

    function addClusterHandler() {
        addToCluster(entryId)
    }

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <div className="w-76  rounded-md" style={{ marginBottom: '10px', backgroundColor: '#194861' }}>
                <div className='flex flex-row '>
                    <Button size='large' style={{ backgroundColor: '#194861', width: '74%', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start', flexDirection: 'row' }} onClick={goToLink}>
                        <Collapsible appear={clusterEntries && clusterEntries.length > 0} clusterEntries={clusterEntries} />
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
                                <IconButton size='large' edge='start' color='error' sx={{ borderRadius: '6px' }} className="icon-btn" onClick={() => { setDeleteVerificationModal(true) }} >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
            {
                deleteVerificationModal &&
                <DeleteVerificationModal message={"list entry"} onCancel={closeModal} onConfirm={deleteEntryHandler} modalState={deleteVerificationModal} />
            }
        </>
    )
}

export default ListEntry;