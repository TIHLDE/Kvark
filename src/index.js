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
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// <Route exact path='/william/' component={Jodel}/> jodel container finnes ikke enda
