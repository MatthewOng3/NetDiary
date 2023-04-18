import '../../styles/ErrorModal.css'

function ErrorModal({isOpen, onClose, children}){
    return(
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="modal-title">Error</h3>
                    <button className="modal-close" onClick={onClose}>
                    &times;
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    )
}

export default ErrorModal;