import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Route} from 'react-router';
import {HashRouter} from 'react-router-dom';

ReactDOM.render(
    <HashRouter>
        <Route exact path="/" render={(props) => <App {...props} test={typeof props.location.test === "undefined" ? false : props.location.test} />}/>
    </HashRouter>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
