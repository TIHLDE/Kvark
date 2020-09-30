import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import URLS from './URLS';
import GA from './analytics';
import { NewsProvider } from './context/NewsContext';
import { ThemeProvider } from './context/ThemeContext';

// Theme
import './assets/css/index.css';

// Service and action imports
import AuthService from './api/services/AuthService';
import MiscService from './api/services/MiscService';
import UserService from './api/services/UserService';

// Project containers
import EventDetails from './containers/EventDetails';
import Companies from './containers/Companies';
import About from './containers/About';
import ContactInfo from './containers/ContactInfo';
import Admin from './containers/Admin';
import UserAdmin from './containers/UserAdmin';
import Events from './containers/Events';
import Services from './containers/Services';
import EventAdministration from './containers/EventAdministration';
import NewStudent from './containers/NewStudent';
import Profile from './containers/Profile';
import JobPosts from './containers/JobPosts';
import JobPostDetails from './containers/JobPostDetails';
import JobPostAdministration from './containers/JobPostAdministration';
import LogIn from './containers/LogIn';
import ForgotPassword from './containers/ForgotPassword';
import Laws from './containers/Laws';
import NewLanding from './containers/NewLanding';
import Http404 from './containers/Http404';
import EventRegistration from './containers/EventRegistration';
import SignUp from './containers/SignUp';
import PrivacyPolicy from './containers/PrivacyPolicy';
import Cheatsheet from './containers/Cheatsheet';
import NewsDetails from './containers/NewsDetails';
import News from './containers/News';
import NewsAdministration from './containers/NewsAdministration';
import EventRules from './containers/EventRules';
import MessageGDPR from './components/miscellaneous/MessageGDPR';

// The user needs to be authorized (logged in and member of an authorized group) to access these routes
const requireAuth = (OriginalComponent, accessGroups = []) => {
  function App(props) {
    const { match } = props;
    const isAuthenticated = AuthService.isAuthenticated();
    const [isLoading, setIsLoading] = useState(true);
    const [allowAccess, setAllowAccess] = useState(false);

    useEffect(() => {
      let isSubscribed = true;
      UserService.getUserData().then((user) => {
        if (isSubscribed) {
          accessGroups.forEach((group) => {
            switch (group.toLowerCase()) {
              case 'hs':
                if (user?.groups.includes('HS')) {
                  setAllowAccess(true);
                }
                break;
              case 'promo':
                if (user?.groups.includes('Promo')) {
                  setAllowAccess(true);
                }
                break;
              case 'nok':
                if (user?.groups.includes('NoK')) {
                  setAllowAccess(true);
                }
                break;
              case 'devkom':
                if (user?.groups.includes('DevKom')) {
                  setAllowAccess(true);
                }
                break;
              default:
                break;
            }
          });
          if (isAuthenticated && accessGroups.length === 0) {
            setAllowAccess(true);
          }
          setIsLoading(false);
        }
      });
      return () => (isSubscribed = false);
    }, [isAuthenticated]);

    if (isLoading) {
      return <div>Autentiserer...</div>;
    }
    if (!isAuthenticated) {
      MiscService.setLogInRedirectURL(match.path);
      return <Redirect to={URLS.login} />;
    }
    if (allowAccess) {
      return <OriginalComponent {...props} />;
    } else {
      return <Redirect to={URLS.landing} />;
    }
  }

  App.propTypes = {
    match: PropTypes.object,
  };

  return App;
};

const Application = () => {
  return (
    <NewsProvider>
      <ThemeProvider>
        <Provider store={store}>
          <BrowserRouter>
            {GA.init() && <GA.RouteTracker />}
            <Switch>
              <Route component={NewLanding} exact path='/' />
              <Route component={EventRegistration} path={URLS.events.concat(':id/registrering')} />
              <Route component={EventDetails} path={URLS.events.concat(':id/')} />
              <Route component={About} path={URLS.about} />
              <Route component={ContactInfo} path={URLS.contactInfo} />
              <Route component={Events} path={URLS.events} />
              <Route component={Services} path={URLS.services} />
              <Route component={Companies} path={URLS.company} />
              <Route component={NewStudent} path={URLS.newStudent} />
              <Route component={Profile} path={URLS.profile} />
              <Route component={JobPostDetails} path={URLS.jobposts.concat(':id/')} />
              <Route component={JobPosts} exact path={URLS.jobposts} />
              <Route component={Laws} path={URLS.laws} />
              <Route component={PrivacyPolicy} path={URLS.privacyPolicy} />
              <Route component={EventRules} path={URLS.eventRules} />
              <Route component={NewsDetails} path={URLS.news.concat(':id/')} />
              <Route component={News} path={URLS.news} />

              <Route component={requireAuth(Cheatsheet)} path={URLS.cheatsheet.concat(':studyId/:classId/')} />
              <Route component={requireAuth(Cheatsheet)} path={URLS.cheatsheet} />

              <Route component={requireAuth(Admin, ['HS', 'Promo', 'Nok', 'Devkom'])} exact path={URLS.admin} />
              <Route component={requireAuth(UserAdmin, ['HS', 'Devkom'])} path={URLS.userAdmin} />
              <Route component={requireAuth(JobPostAdministration, ['HS', 'Nok', 'Devkom'])} path={URLS.jobpostsAdmin} />
              <Route component={requireAuth(EventAdministration, ['HS', 'Promo', 'Nok', 'Devkom'])} path={URLS.eventAdmin} />
              <Route component={requireAuth(NewsAdministration, ['HS', 'Promo', 'Nok', 'Devkom'])} path={URLS.newsAdmin} />

              <Route component={LogIn} path={URLS.login} />
              <Route component={ForgotPassword} path={URLS.forgotPassword} />
              <Route component={SignUp} path={URLS.signup} />

              <Route component={Http404} />
            </Switch>
            <MessageGDPR />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </NewsProvider>
  );
};

// eslint-disable-next-line no-console
console.log('Snoker rundt du? Det liker vi. Vi i DevKom ser alltid etter nye medlemmer.');

ReactDOM.render(<Application />, document.getElementById('root'));
