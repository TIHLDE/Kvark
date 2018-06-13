
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Landing from './containers/Landing';
import Companies from './containers/Companies';
import Components from './containers/Components';

import './assets/css/index.css';

render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/bedrifter/' component={Companies}/>
            <Route path='/components/' component={Components}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
