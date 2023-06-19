import '../styles/Button.css'
import '../styles/ListEntry.css'

//Components
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
import { Fade, Modal } from '@mui/material';

//Redux store
import { useDispatch, useSelector } from 'react-redux';
import { deleteEntry } from '../store/categorySlice';
import { useEffect, useState } from 'react';
import DeleteVerificationModal from './DeleteVerificationModal';
import { getClusterReducerStatus, selectClusterById, fetchClusterEntries, updateClusterAdd, getIndividualClusterStatus } from '../store/clusterSlice';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { setNormalEntryDetails, updateDeleteModalState, updateEntryModalState, getDeleteModalOpenState, resetEntryModalDetails, setClickedEntryId, setClickedClusterEntryId } from '../store/modalSlice';


/**
 * @description Component that handles each individual webpage entry, allow users to click on it, edit or delete it
 * @param allowEdit True if user's dashboard, false if it's a shared category component
 * @param editEntry Function passed in through category comp to 
 * @param canAddCluster Boolean value to indicate if the list entry will show the add button to add to cluster
 * @see CategoryComp
 */
function ListEntry({ text_description, link, entryId, catId, allowEdit, canAddCluster }) {

    const dispatch = useDispatch()
    const collectionId = useSelector((store) => store.collection.currentCollection)
    //const [deleteVerificationModal, setDeleteVerificationModal] = useState(false) //State for showing delete verification modal
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    //Cluster states
    //const clusterStatus = useSelector(getClusterReducerStatus)
    const clusterStatus = useSelector(state => getIndividualClusterStatus(state, entryId))
    const cluster = useSelector(state => selectClusterById(state, entryId));

    //Retrieve category state
    const categoryState = useSelector((store) => store.category);

    useEffect(() => {
        //If on idle status and current collection id is not undefined, fetch categories from backend
        if (clusterStatus === 'idle') {
            dispatch(fetchClusterEntries(entryId))
        }
        else if (clusterStatus === 'success') {
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
     * @description Open list entry link and all cluster links associated with it in a new tab
     */
    function goToLink() {
        window.open(link, text_description)

        cluster.forEach((element) => {
            window.open(element.link, element.name)
        });
    }

    /**
     * @description Update list entry by updating entry modal details to display data, and update clicked entry id
     * @see CategoryComp
     */
    function updateEntry() {
        dispatch(setNormalEntryDetails({ catId: catId, entryId: entryId, categoryState: categoryState }))
        dispatch(setClickedEntryId(entryId))
        dispatch(updateEntryModalState(true))
    }

    /**
     * @description Delete list entry
     * @see deleteEntry CategorySlice
     */
    function deleteEntryHandler() {
        dispatch(deleteEntry({ entryId: entryId, catId: catId, collectionId: collectionId }));
        setIsDeleteModalOpen(false)
    }

    /**
     * @description Create new entry cluster by opening EntryModal and passing in entry id
     * @param {string} clusterId Id used to identify cluster 
     * @see ListEntry
     */
    function addToCluster() {
        dispatch(updateClusterAdd(true))
        //Reset entry modal details since it is a cluster add
        dispatch(resetEntryModalDetails())
        //Set clicked entry id
        dispatch(setClickedEntryId(entryId))
        //Reset clicked cluster entry id
        dispatch(setClickedClusterEntryId(""))
        //Display entry modal
        dispatch(updateEntryModalState(true))
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
                        {cluster && cluster.length > 0 &&
                            <IconButton size='medium' edge='start' color='default' onClick={decoratedOnClick} disableRipple>
                                <ChevronRightIcon sx={{ transform: isOpen ? 'rotate(90deg)' : 'initial' }} />
                            </IconButton>}
                        <Button size='large' className='openLinks' onClick={goToLink} style={{ backgroundColor: '#194861', width: '74%', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <div className="flex-1">
                                <text className='page-name'>{text_description}</text>
                            </div>
                        </Button>
                        {allowEdit && (
                            <div className='p-1 flex flex-row justify-evenly'>
                                {canAddCluster &&
                                    <Tooltip title="Add to cluster">
                                        <IconButton size='large' className="icon-btn" onClick={addToCluster} sx={{ color: 'black' }}>
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
                                    <IconButton size='large' edge='start' color='error' sx={{ borderRadius: '6px' }} className="icon-btn" onClick={() => setIsDeleteModalOpen(true)} >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )}

                    </div>
                </div>
                <Accordion.Collapse eventKey="0">
                    <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                        {
                            isOpen && cluster && cluster.map((value, index) => (
                                <ClusterEntry key={RandomId() + index} clusterDesc={value.name} allowEdit={true} link={value.link} clusterId={entryId} clusterEntryId={value.clusterEntryId} />
                            ))
                        }
                    </div>
                </Accordion.Collapse>
            </Accordion>
            {
                isDeleteModalOpen &&
                <Modal open={isDeleteModalOpen}>
                    <Fade in={isDeleteModalOpen}>
                        <div className="flex h-full justify-center">
                            <DeleteVerificationModal message={"list entry"} onCancel={() => setIsDeleteModalOpen(false)} onConfirm={deleteEntryHandler} />
                        </div>
                    </Fade>
                </Modal>
            }
        </>
    )
}

export default ListEntry;