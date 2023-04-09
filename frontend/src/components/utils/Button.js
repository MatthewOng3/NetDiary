
import '../../styles/Button.css'

function Button({children, onClick, width, height, color, disabled}){
    const styles = {
        root:{
            backgroundColor: color,
            width: width,
            height: height,
            
        },
    }
    
    return(
        <button style={styles.root} onClick={onClick}  disabled={disabled} className='button'>
            <text className="text">
                {children}
            </text>
        </button>
    )
}

export default Button;