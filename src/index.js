import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import Landing from './containers/Landing';
import Companies from './containers/Companies';
import Showcase from './containers/Showcase';
import GridShowcase from './containers/GridShowcase';
import NotFound from './containers/NotFound';

import './assets/css/index.css';
import './assets/css/redir.css';
import './assets/css/showcase.css';

render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/bedrifter/' component={Companies}/>
            <Route path='/gridshowcase/' component={GridShowcase}/>
            <Route path='/showcase/' component={Showcase}/>
            <NotFound />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
