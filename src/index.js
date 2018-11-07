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
import EventDetails from './containers/EventDetails';
import Companies from './containers/Companies';
import About from './containers/About';
import Events from './containers/Events';
import Services from './containers/Services';
import DataRegistrator from './containers/DataRegistrator';
import NewStudent from './containers/NewStudent';
import MyProfile from './containers/MyProfile';

// TODO Make container
import Login from './components/Login';

const Application = (
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <Switch>
                    <Route exact path='/' component={Landing}/>
                    <Route path='/nyheter/:id' component={NewsPage}/>
                    <Route path='/arrangementer/:id' component={EventDetails}/>
                    <Route path={URLS.about} component={About} />
                    <Route path={URLS.events} component={Events} />
                    <Route path={URLS.services} component={Services} />
                    <Route path={URLS.company} component={Companies} />
                    <Route path={URLS.newStudent} component={NewStudent} />
                    <Route path={URLS.MyProfile} component={MyProfile} />
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
