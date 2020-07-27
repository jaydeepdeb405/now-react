import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import App from "./App";

if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = process.env.HOST;
    axios.defaults.auth = {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    };
}
else {
    axios.defaults.headers['X-userToken'] = window.g_ck;
}

ReactDOM.render(<App />, document.getElementsByTagName('root')[0]);
