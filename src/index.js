import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import './assets/css/index.css';

// Project containers
import Landing from './containers/Landing';
import Companies from './containers/Companies';
import GridShowcase from './containers/GridShowcase';

render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/bedrifter/' component={Companies}/>
            <Route exact path='/gridshowcase/' component={GridShowcase} />
            <Route exact path='/william/' component={Jodel}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
