import logo from './logo.svg';
import React from 'react';
import './HomeDrop.css';
import { useState, useEffect } from 'react';

function Download() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Fetch the list of available files when the component mounts
        fetch('/Download')
            .then((response) => response.text())
            .then((data) => {
                // Assuming that the server is rendering the EJS template
                // You can parse the data if needed
                // For example, you can convert the response text into an array of files
                const filesArray = data.split(',');
                setFiles(filesArray);
            })
            .catch((error) => console.error('Error fetching files:', error));
    }, []);

    return (
        <div className="HomeDrop">
            <header className="HomeDrop-header">
                <h1>Choose Files to Download</h1>
                <ul>
                    {files.map((file) => (
                        <li key={file}>
                            <a href={`/download/${file}`} download>
                                {file}
                            </a>
                        </li>
                    ))}
                </ul>
                {files.length === 0 ? <p>Empty :(</p> : <p>{files.length} files</p>}
                <a className="HomeDrop-link" href="/HomeDrop">
                    Upload Files To Server
                </a>
            </header>
        </div>
    );
}

export default Download;




/*za drug put
import logo from './logo.svg';
import React from 'react';
import './HomeDrop.css';
import { useState, useEffect } from 'react';

function Download() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Fetch the list of available files when the component mounts
        fetch('/download')
            .then((response) => response.json())
            .then((data) => setFiles(data.files))
            .catch((error) => console.error('Error fetching files:', error));
    }, []);

    return (
        <div className="HomeDrop">
            <header className="HomeDrop-header">
                <h1>Choose Files to Download</h1>
                <ul>
                    {files.map((file) => (
                        <li key={file}>
                            <a href={`/download/${file}`} download>
                                {file}
                            </a>
                        </li>
                    ))}
                </ul>
                {files.length === 0 ? <p>Empty :(</p> : <p>{files.length} files</p>}
                <a className="HomeDrop-link" href="/HomeDrop">
                    Upload Files To Server
                </a>
            </header>
        </div>
    );
  }
    
  export default Download;*/