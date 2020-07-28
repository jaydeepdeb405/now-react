import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import App from "./App";

if (process.env.NODE_ENV === 'development') {
    /**
     * DEVELOPMENT MODE AXIOS CONFIG
     * Setting axios default basic auth credentials from servicenow.config
     */  
    axios.defaults.auth = {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    };
}
else {
    /**
     * PRODUCTION MODE AXIOS CONFIG
     * Setting axios default header using servicenow session token
     */ 
    axios.defaults.headers['X-userToken'] = window.g_ck;
}

ReactDOM.render(<App />, document.getElementsByTagName('root')[0]);
