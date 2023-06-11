
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setClusterEntryDetails, updateEntryModalState } from '../store/modalSlice';

/**
 * @description Collapsible list component that displays the cluster entry
 * @param appear Boolean value to show the collapsible lists if true
 * @see ListEntry
 */
function ClusterEntry({ clusterDesc, link, clusterId, clusterEntryId, allowEdit, editEntry }) {
    const dispatch = useDispatch();
    const clusterState = useSelector((store) => store.cluster);


    /**
     * @description Open link in a new tab when the entry is clicked
     */
    function goToLink() {
        window.open(link, '_blank').focus();
    }

    function updateClusterEntry() {
        // editEntry(clusterId, clusterEntryId)
        dispatch(setClusterEntryDetails({ clusterId: clusterId, clusterEntryId: clusterEntryId, clusterState: clusterState }))
        dispatch(updateEntryModalState(true))
    }

    return (
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
                        <IconButton size='large' edge='start' color='error' sx={{ borderRadius: '6px' }} className="icon-btn" >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default ClusterEntry;