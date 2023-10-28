import logo from './logo.svg';
import React from 'react';
import './HomeDrop.css';

function HomeDrop() {
    return (
        <div className="HomeDrop">
        <header className="HomeDrop-header">
        <h1>Choose Files to HomeDrop</h1>
            <form action="/HomeDrop/" method="post" enctype="multipart/form-data">
            <label for="fileInput">Select files:</label>
            <input type="file" id="fileInput" name="fileInput" multiple></input>
            <button type="submit">Upload</button>
            </form>
            
            <a className="HomeDrop-link" href='/Download'>Download Files From Server</a>
        </header>
        </div>
    );
  }
  
  export default HomeDrop;