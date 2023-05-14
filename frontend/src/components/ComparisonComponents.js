import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

/**
 * @description Component with X icon on the left and text on the right
 * @param children prop
 * @see Comparison
 */
function XIconComponent({ children }){
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5em' }}>
      <CloseIcon sx={{ color: 'red', marginRight: '10px', fontSize: 'inherit' }}/>
      <span>{children}</span>
    </div>
  );
}

/**
 * @description Component with tick icon on the left and text on the right
 * @param children prop
 * @see Comparison
 */
function TickIconComponent({ children }){
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5em' }}>
      <CheckIcon sx={{ color: 'green', marginRight: '10px', fontSize: 'inherit' }}/>
      <span>{children}</span>
    </div>
  );
}

export { XIconComponent, TickIconComponent };