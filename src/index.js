import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store/store';
import URLS from './URLS';

import {MuiThemeProvider} from '@material-ui/core/styles';
import theme from './theme';

import './assets/css/index.css';

// Project containers
import Landing from './containers/Landing';
import NewsPage from './containers/NewsPage';
import ArrangementPage from './containers/Arrangement';
import Groups from './containers/Groups';
import Companies from './containers/Companies';
import About from './containers/About';
import Events from './containers/Events';
import Services from './containers/Services';
import DataRegistrator from './containers/DataRegistrator';

// TODO Make container
import Login from './components/Login';

const Application = (
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <Switch>
                    <Route exact path='/' component={Landing}/>
                    <Route path='/nyheter/:id' component={NewsPage}/>
                    <Route path='/arrangementer/:id' component={ArrangementPage}/>
                    <Route path='/om/' component={About} />
                    <Route path='/arrangementer/' component={Events} />
                    <Route path='/tjenester/' component={Services} />
                    <Route path='/undergrupper/' component={Groups} />
                    <Route path='/bedrifter/' component={Companies} />

                    <Route path={URLS.dataRegistration} component={DataRegistrator} />

                    { /* Testing only */ }
                    <Route path='/login/' component={Login} />
                </Switch>
            </MuiThemeProvider>
        </BrowserRouter>
    </Provider>
);

console.log('Snoker rundt du? Det liker vi. Vi i Nettkom ser alltid etter nye medlemmer.');

ReactDOM.render(Application, document.getElementById('root'));
