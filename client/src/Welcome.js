import logo from './logo.svg';
import React from 'react';
import './HomeDrop.css';

function Welcome() {
    return (
        <div className="HomeDrop">
        <header className="HomeDrop-header">
        <h1>Welcome,</h1>
        <h2 className="WelcomeTo-header">to HomeDrop</h2>
        <p className="WelcomeTo-text">a place where you can transfer files in the local network</p>
        <a className="WelcomeTo-link" href="/HomeDrop">Continue</a>
        </header>
        </div>
    );
  }
  
  export default Welcome;