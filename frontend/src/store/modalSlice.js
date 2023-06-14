import { createSlice } from '@reduxjs/toolkit';
import { selectClusterEntryFromCluster } from './clusterSlice';
import { findListEntry } from './categorySlice';


/**
 * @description Modal Slice that tracks the open status of different modals, performs actions necessary related to the modal
 */
const initialState = { entryModalOpen: false, errorModal: false, clickedEntryId: "", clickedClusterEntryId: "", entryModalDetails: { name: null, link: null } }

const modalSlice = createSlice({
    name: 'modal',
    initialState: initialState,
    reducers: {
        updateEntryModalState: (state, { payload }) => {
            state.entryModalOpen = payload
        },
        /**
         * @description Set the normal list entry details to be displayed in entry modal, finds specific list entry in a category object
         * @param {Object} Payload fields 
         * @see EntryModal
         */
        setNormalEntryDetails: (state, action) => {
            const { catId, entryId, categoryState } = action.payload;

            const foundEntry = findListEntry(categoryState, catId, entryId)

            state.entryModalDetails.name = foundEntry.name
            state.entryModalDetails.link = foundEntry.link
        },
        /**
         * @description Set the cluster entry details to be displayed in entry modal, finds cluster entry from a specific cluster
         * @param {Object} Payload fields 
         * @see EntryModal
         */
        setClusterEntryDetails: (state, action) => {
            //Retrieve cluster from cluster slice
            const { clusterId, clusterEntryId, clusterState } = action.payload;

            const foundClusterEntry = selectClusterEntryFromCluster(clusterState, clusterId, clusterEntryId)
            state.entryModalDetails.name = foundClusterEntry.name
            state.entryModalDetails.link = foundClusterEntry.link
        },
        resetEntryModalDetails: (state, action) => {
            state.entryModalDetails.name = ""
            state.entryModalDetails.link = ""
        },
        setClickedEntryId: (state, { payload }) => {
            state.clickedEntryId = payload
        },
        setClickedClusterEntryId: (state, { payload }) => {
            state.clickedClusterEntryId = payload
        },
        //Reset modal state
        resetModalState: (state = initialState, { payload }) => {
            return initialState
        }
    },
})

//Functions to retrieve state values
export const getEntryModalDetails = (state) => state.modal.entryModalDetails
export const getEntryModalOpenState = (state) => state.modal.entryModalOpen
export const getClickedEntryId = (state) => state.modal.clickedEntryId
export const getClickedClusterEntryId = (state) => state.modal.clickedClusterEntryId

export const { updateEntryModalState, resetModalState, setNormalEntryDetails, setClusterEntryDetails, resetEntryModalDetails, setClickedEntryId, setClickedClusterEntryId } = modalSlice.actions;
export default modalSlice.reducer;