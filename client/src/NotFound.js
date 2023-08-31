import React from 'react';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="notfound_header">404 Not Found</h1>
        <p className="notfound_text">The page you're looking for doesn't exist.</p>
        <a className="notfound_link" href="/">Go back to Home</a>
      </div>
    </div>
  );
}

export default NotFound;
