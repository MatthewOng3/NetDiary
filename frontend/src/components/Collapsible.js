import { useState } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from "@mui/material";

/**
 * @description Collapsible list component that displays the cluster entry
 * @param appear Boolean value to show the collapsible lists if true
 * @see ListEntry
 */
function Collapsible({ open, appear, clusterEntries }) {
  const [isOpen, setIsOpen] = useState(open);

  function handleFilterOpening(event) {
    event.stopPropagation();
    event.preventDefault();
    setIsOpen((prev) => !prev);
  };
  console.log(isOpen)
  return (
    <div className="">
      {appear &&
        <IconButton size='medium' edge='start' color='default' onClick={handleFilterOpening}>
          <ChevronRightIcon sx={{ transform: isOpen ? 'rotate(90deg)' : 'initial' }} />

        </IconButton>
      }
    </div>
  );
};

export default Collapsible;