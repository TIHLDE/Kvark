import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import URLS from './URLS';

// Theme
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import './assets/css/index.css';

// Service imports
import AuthService from './api/services/AuthService';

// Project containers
import Landing from './containers/Landing';
import NewsPage from './containers/NewsPage';
import EventDetails from './containers/EventDetails';
import Companies from './containers/Companies';
import About from './containers/About';
import Events from './containers/Events';
import Services from './containers/Services';
import EventAdministration from './containers/EventAdministration';
import NewStudent from './containers/NewStudent';
import Profile from './containers/Profile';
import JobPosts from './containers/JobPosts';
import JobPostDetails from './containers/JobPostDetails';
import JobPostAdministration from './containers/JobPostAdministration';
import LogIn from './containers/LogIn';
import Laws from './containers/Laws';
import NewLanding from './containers/NewLanding';

// The user needs to be authorized (logged in) to access these routes
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => (
                (AuthService.isAuthenticated()) ?
                    <Component {...props} /> :
                    <Redirect to={URLS.login} />
            )}
        />
    );
};

const Application = (
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <Switch>
                    <Route exact path='/' component={NewLanding} />
                    <Route path='/nyheter/:id' component={NewsPage} />
                    <Route path='/arrangementer/:id' component={EventDetails} />
                    <Route path={URLS.about} component={About} />
                    <Route path={URLS.events} component={Events} />
                    <Route path={URLS.services} component={Services} />
                    <Route path={URLS.company} component={Companies} />
                    <Route path={URLS.newStudent} component={NewStudent} />
                    <Route path={URLS.profile} component={Profile} />
                    <Route path={URLS.jobposts.concat(':id/')} component={JobPostDetails} />
                    <Route exact path={URLS.jobposts} component={JobPosts} />
                    <Route path={URLS.laws} component={Laws} />

                    <PrivateRoute path={URLS.jobpostsAdmin} component={JobPostAdministration} />
                    <PrivateRoute path={URLS.eventAdmin} component={EventAdministration} />
                    <Route path={URLS.login} component={LogIn} />

                </Switch>
            </MuiThemeProvider>
        </BrowserRouter>
    </Provider>
);

console.log('Snoker rundt du? Det liker vi. Vi i Nettkom ser alltid etter nye medlemmer.');

ReactDOM.render(Application, document.getElementById('root'));
