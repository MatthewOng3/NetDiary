import { createSlice } from '@reduxjs/toolkit';
import { selectClusterEntryFromCluster } from './clusterSlice';
import { findListEntry } from './categorySlice';


/**
 * @description Modal Slice that tracks the open status of different modals, performs actions necessary related to the modal
 */
const initialState = { deleteModalOpen: false, entryModalOpen: false, errorModal: false, entryModalDetails: { name: null, link: null }, clusterAdd: false }

const modalSlice = createSlice({
    name: 'modal',
    initialState: initialState,
    reducers: {
        updateEntryModalState: (state, { payload }) => {
            state.entryModalOpen = payload
        },
        updateDeleteModalState: (state, { payload }) => {
            state.deleteModalOpen = payload
        },
        setNormalEntryDetails: (state, action) => {
            const { catId, entryId, categoryState } = action.payload;

            const foundEntry = findListEntry(categoryState, catId, entryId)

            state.entryModalDetails.name = foundEntry.name
            state.entryModalDetails.link = foundEntry.link
        },
        setClusterEntryDetails: (state, action) => {
            //Retrieve cluster from cluster slice
            const { clusterId, clusterEntryId, clusterState } = action.payload;

            const foundClusterEntry = selectClusterEntryFromCluster(clusterState, clusterId, clusterEntryId)
            console.log("IN ENTRY MODAL", foundClusterEntry)
            state.entryModalDetails.name = foundClusterEntry.name
            state.entryModalDetails.link = foundClusterEntry.link
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
export const getDeleteModalOpenState = (state) => state.modal.deleteModalOpen

export const { updateEntryModalState, resetModalState, setNormalEntryDetails, setClusterEntryDetails, updateDeleteModalState } = modalSlice.actions;
export default modalSlice.reducer;