import { useState } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from "@mui/material";


function Collapsible({open, clusterEntries}){
  const [isOpen, setIsOpen] = useState(open);

  function handleFilterOpening(event){
    event.stopPropagation();
    event.preventDefault();
    setIsOpen((prev) => !prev);
  };
  
  return (
    <div className="">
      <IconButton size='medium' edge='start' color='default' onClick={handleFilterOpening}>
        <ChevronRightIcon sx={{ transform: isOpen ? 'rotate(90deg)' : 'initial' }}/>
      </IconButton>
    </div>
  );
};

export default Collapsible;