import logo from './logo.svg';
import React from 'react';
import './HomeDrop.css';

function HomeDrop() {
    return (
        <div className="HomeDrop">
        <header className="HomeDrop-header">
        <h1>Choose a File to HomeDrop</h1>
            <form action="/HomeDrop/" method="post" enctype="multipart/form-data">
            <label for="fileInput">Select a file:</label>
            <input type="file" id="fileInput" name="fileInput"></input>
            <button type="submit">Upload</button>
            </form>
        </header> 
        </div>
    );
  }
  
  export default HomeDrop;