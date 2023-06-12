import { createSlice } from '@reduxjs/toolkit';
import { selectClusterEntryFromCluster } from './clusterSlice';
import { findListEntry } from './categorySlice';


/**
 * @description Modal Slice that tracks the open status of different modals, performs actions necessary related to the modal
 */
const initialState = { deleteModalOpen: false, entryModalOpen: false, errorModal: false, clickedEntryId: "", clickedClusterEntryId: "", entryModalDetails: { name: null, link: null } }

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
            state.entryModalDetails.name = foundClusterEntry.name
            state.entryModalDetails.link = foundClusterEntry.link
        },
        resetEntryModalDetails: (state, action) => {
            console.log("IN RESET ENTRY MODAL DETAILS")
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
export const getDeleteModalOpenState = (state) => state.modal.deleteModalOpen
export const getClickedEntryId = (state) => state.modal.clickedEntryId
export const getClickedClusterEntryId = (state) => state.modal.clickedClusterEntryId

export const { updateEntryModalState, resetModalState, setNormalEntryDetails, setClusterEntryDetails, updateDeleteModalState, resetEntryModalDetails, setClickedEntryId, setClickedClusterEntryId } = modalSlice.actions;
export default modalSlice.reducer;