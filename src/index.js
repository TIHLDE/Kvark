import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from './containers/Landing';
import Companies from './containers/Companies';

import './assets/css/index.css';

render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/bedrifter/' component={Companies}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

