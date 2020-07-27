import React from 'react';
import './WelcomeComponent.scss';

export default function WelcomeComponent() {
    return (
        <div className="container">
            <div className="heading">Welcome to React with ServiceNow</div>
            <div className="react-logo"></div>
            <div className="sn-logo"></div>
            <div className="info">This package lets you build React applications & deploy it on a ServiceNow instance</div>
            <div className="info">Orlando & above instances are supported</div>
            <div className="links">
                <a className="link" href="https://developer.servicenow.com/dev.do#!/guide/now-experience">Click here to know about Now Experience UI Framework</a><br />
                <a className="link" href="https://reactjs.org/tutorial/tutorial.html">Click here for React tutorial</a>
            </div>
        </div>
    )
}
