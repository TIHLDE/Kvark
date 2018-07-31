import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store/store';

import './assets/css/index.css';

// Project containers
import Landing from './containers/Landing';
import NewsPage from './containers/NewsPage';
import ArrangementPage from './containers/Arrangement';
import Groups from './containers/Groups';
import Companies from './containers/Companies';

// TODO Make container
import Login from './components/Login';

const Application = (
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Landing}/>
                <Route path='/nyheter/:id' component={NewsPage}/>
                <Route path='/arrangementer/' component={ArrangementPage}/>
                <Route path='/undergrupper/' component={Groups} />
                <Route path='/bedrifter/' component={Companies} />

                { /* Testing only */ }
                <Route path='/login/' component={Login} />
            </Switch>
        </BrowserRouter>
    </Provider>
);

console.log('Snoker rundt du? Det liker vi. Vi i Nettkom ser alltid etter nye medlemmer.');

ReactDOM.render(Application, document.getElementById('root'));
