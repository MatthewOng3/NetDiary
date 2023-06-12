import '../styles/DeleteVerificationModal.css';
import { Fade, Modal } from '@mui/material';

function DeleteVerificationModal({ message, onCancel, onConfirm }) {
    return (


        <div className="delete-confirmation-modal">
            <div className="delete-confirmation-modal__content">
                <div className="delete-confirmation-modal__message">{"Are you sure you want to delete this " + message + "?"}</div>
                <div className="delete-confirmation-modal__buttons">
                    <button className="delete-confirmation-modal__cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="delete-confirmation-modal__confirm-button" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>


    );
};

export default DeleteVerificationModal;