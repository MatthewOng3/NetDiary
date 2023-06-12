
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setClickedClusterEntryId, setClickedEntryId, setClusterEntryDetails, updateDeleteModalState, updateEntryModalState } from '../store/modalSlice';
import { deleteClusterEntry, updateClusterAdd } from '../store/clusterSlice';

/**
 * @description Collapsible list component that displays the cluster entry
 * @param appear Boolean value to show the collapsible lists if true
 * @see ListEntry
 */
function ClusterEntry({ clusterDesc, link, clusterId, clusterEntryId, allowEdit }) {
    const dispatch = useDispatch();
    const clusterState = useSelector((store) => store.cluster);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)


    /**
     * @description Open link in a new tab when the entry is clicked
     */
    function goToLink() {
        window.open(link, '_blank').focus();
    }

    /**
     * @description Function to update cluster entry by setting isClusterAdd to true and the relevant clicked Id's
     * @see ModalSlice
     * @see ClusterSlice
     * @see EntryModal
     */
    function updateClusterEntry() {
        dispatch(setClickedEntryId(clusterId))
        dispatch(updateClusterAdd(true))
        dispatch(setClickedClusterEntryId(clusterEntryId))
        dispatch(setClusterEntryDetails({ clusterId: clusterId, clusterEntryId: clusterEntryId, clusterState: clusterState }))
        dispatch(updateEntryModalState(true))
    }

    /**
     * @description Delete a specific cluster entry from a cluster
     * @see ClusterSlice
     */
    function deleteClusterEntryHandler() {
        dispatch(deleteClusterEntry({ clusterId: clusterId, clusterEntryId: clusterEntryId }))
        setIsDeleteModalOpen(false)
    }

    return (
        <>
            <div className="rounded-md mt-2 flex flex-row" style={{ marginBottom: '10px', width: '85%', backgroundColor: '#194861' }}>
                <Button size='large' style={{ width: '74%', borderRadius: '7px', display: 'flex', justifyContent: 'flex-start', flexDirection: 'row' }} onClick={goToLink}>
                    <div className="flex-1">
                        <text className='page-name'>{clusterDesc}</text>
                    </div>
                </Button>
                {allowEdit && (
                    <div className='p-1 flex flex-row justify-evenly'>
                        <Tooltip title="Edit entry">
                            <IconButton size='large' color='primary' className="icon-btn" onClick={updateClusterEntry} style={{ color: 'black' }}>
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
            {
                isDeleteModalOpen &&
                <Modal open={isDeleteModalOpen}>
                    <Fade in={isDeleteModalOpen}>
                        <div className="flex h-full justify-center">
                            <DeleteVerificationModal message={"category"} onCancel={() => setIsDeleteModalOpen(false)} onConfirm={deleteClusterEntry} />
                        </div>
                    </Fade>
                </Modal>
            }
        </>
    );
};

export default ClusterEntry;