import '../styles/EntryModal.css'
import { Form } from "react-bootstrap";
import { useEffect, useState } from 'react'; 
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TurnedInIcon from '@mui/icons-material/TurnedIn';

//Redux functions
import { saveEntry } from '../store/categorySlice';
import { useDispatch, useSelector } from 'react-redux';
import cleanInputData from '../security/CleanInputData';
import validateURL from '../util/ValidateURL';

/**
 * @description Entry modal that appears when users edit or create a new list entry
 * @param closeModal
 * @author Matt
 * @path /
 */
function EntryModal({closeModal, catId, entryId}){
   
    //States to keep track of the input by user
    const [enteredDescription, setEnteredDescription] = useState('')
    const [open, setOpen] = useState(false)
    const [enteredLink, setEnteredLink] = useState('')
    const [validated, setValidated] = useState(false);
    const categoryList = useSelector((store) => store.category.value) //Get current category list state
    const collectionId = useSelector((store) => store.collection.currentCollection)
    const dispatch = useDispatch()

    //Display link and description if it exists
    useEffect(()=>{
        //If entry id is false, meaning there is none
        if (!entryId){
            return
        }
        
        //Retrieve matching category item
        const catItem = categoryList.find((item) => {
            return item.catId === catId
        })
         
        //Find list entry if it exists
        const foundEntry = catItem.listEntries.find((item)=>{
            return item.entryId === entryId
        })
        
        //If entry is found then update the value in the description and link states to display in the entry modal
        if(foundEntry){
            setEnteredDescription(foundEntry.name)
            setEnteredLink(foundEntry.link)
        }
    },[])

    //Save entry  
    function saveListEntry(event){
        setValidated(false)
        //Sanitize link and validate url
        const cleanedLink = cleanInputData(enteredLink)
        const cleanedDescription = cleanInputData(enteredDescription)

        if(!validateURL(enteredLink)){
            setEnteredLink("") //If fail then set entered link to null
            setValidated(true)
            return 
        }   
        
        //Save entry to database
        dispatch(saveEntry({description: cleanedDescription, link: cleanedLink, catId: catId, entryId: entryId, collectionId: collectionId}))
        closeModal()
    }
    
    return(
        <div className="popup-container">
            <div className=" bg-slate-700 form-container ">
                <div style={{justifyContent: 'flex-end', flexDirection: 'row', display: 'flex'}}>
                    <IconButton size='medium' color='default' sx={{backgroundColor: 'transparent'}}  onClick={closeModal}>
                        <CloseIcon size="large"/>
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
                        onChange={(event)=>{setEnteredDescription(event.target.value)}}
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
                        onChange={(event)=>{setEnteredLink(event.target.value)}}
                        isInvalid={validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        Unsafe Url detected
                    </Form.Control.Feedback>
                </Form.Group>
                
                <div className= "mt-3" style={{justifyContent: 'space-evenly', display: 'flex' }}>
                    <button
                    className="px-8 py-2 rounded-3xl text-orange-400 hover:text-white  border-2 border-orange-500 hover:bg-orange-600" onClick={saveListEntry}
                    >
                        Save
                        <TurnedInIcon className='ml-1'/>
                    </button>
                    <button
                    className="px-8 py-2 rounded-3xl text-orange-400 hover:text-white  border-2 border-orange-500 hover:bg-orange-600"
                    >
                        Add to cluster
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

