import React from 'react';
import { Spinner } from 'react-bootstrap';
import "../../styles/LoadingSpinner.css"

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    </div>
  );
};

export default LoadingSpinner;