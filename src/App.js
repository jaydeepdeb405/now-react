import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import icon from './images/react-favicon.ico';
import Favicon from 'react-favicon';
import MetaTags from 'react-meta-tags';
import WelcomeComponent from "./components/WelcomeComponent";
import RestMessage from "./RestMessage";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    /*
     * Fetch 5 incidents & log in browser console
     */
    async componentDidMount() {
        try {
            const rm = new RestMessage('/api/now/table/incident');
            rm.setHttpMethod('GET');
            rm.setQueryParameter('sysparm_limit', '5');
            const response = await rm.execute();
            console.log(response.getBody());
        }
        catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
            <>
                {/* Favicon plugin to insert HTML header icon */}
                <Favicon url={icon} />
                {/* MetaTags plugin to insert html metadata */}
                <MetaTags>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </MetaTags>
                {/* Setting base url path for the application, in development mode */}
                <Router basename={process.env.APP_URL_BASE}>
                    <Switch>
                        <Route exact path="/">
                            <WelcomeComponent />
                        </Route>
                    </Switch>
                </Router>
            </>
        )
    }
}
