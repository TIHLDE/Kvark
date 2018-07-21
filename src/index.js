import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import './assets/css/index.css';

// Project containers
import Landing from './containers/Landing';
import NewsPage from './containers/NewsPage';
import Groups from './containers/Groups';
import Companies from './containers/Companies';


render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/nyheter/' component={NewsPage}/>
            <Route path='/undergrupper/' component={Groups} />
            <Route path='/bedrifter/' component={Companies} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// <Route exact path='/william/' component={Jodel}/> jodel container finnes ikke enda
