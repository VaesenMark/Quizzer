import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import {RRHN_App} from './components/App';
import EmptyPanel from './components/EmptyPanel';
import PreferencesDialog from './components/PreferencesDialog'
import IFramePanel from './components/IFrameArea'

const theRoutingSpecification = (
    <Router history={browserHistory}>
        <Route path="/" component={RRHN_App} >
            <IndexRoute component={EmptyPanel} />
            <Route path="preferences" component={PreferencesDialog} />
            <Route path="item/:id" component={IFramePanel} />
        </Route>
    </Router>
);
ReactDOM.render(theRoutingSpecification, document.getElementById('react-root'));
