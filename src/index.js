import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from './containers/Landing';
import Companies from './containers/Companies';
import NotFound from './containers/NotFound';

import './assets/css/index.css';
import './assets/css/redir.css';

render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/bedrifter/' component={Companies}/>
            <NotFound />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

