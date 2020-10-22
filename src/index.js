import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './assets/css/index.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ScrollMemory from 'react-router-scroll-memory';
import { Provider } from 'react-redux';
import store from './store/store';
import URLS from './URLS';
import GA from './analytics';
import { NewsProvider } from './context/NewsContext';
import { ThemeProvider } from './context/ThemeContext';

// Service and action imports
import AuthService from './api/services/AuthService';
import { useMisc, MiscProvider } from './api/hooks/Misc';
import { useUser, UserProvider } from './api/hooks/User';

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
    const { getUserData } = useUser();
    const { setLogInRedirectURL } = useMisc();
    const isAuthenticated = AuthService.isAuthenticated();
    const [isLoading, setIsLoading] = useState(true);
    const [allowAccess, setAllowAccess] = useState(false);

    useEffect(() => {
      let isSubscribed = true;
      getUserData()
        .then((user) => {
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
                case 'index':
                  if (user?.groups.includes('Index')) {
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
        })
        .catch(() => {});
      return () => (isSubscribed = false);
    }, [isAuthenticated, getUserData]);

    if (isLoading) {
      return <div>Autentiserer...</div>;
    }
    if (!isAuthenticated) {
      setLogInRedirectURL(match.path);
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
    <MiscProvider>
      <UserProvider>
        <NewsProvider>
          <ThemeProvider>
            <Provider store={store}>
              <BrowserRouter>
                {GA.init() && <GA.RouteTracker />}
                <ScrollMemory />
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

                  <Route component={requireAuth(Admin, ['HS', 'Promo', 'Nok', 'Index'])} exact path={URLS.admin} />
                  <Route component={requireAuth(UserAdmin, ['HS', 'Index'])} path={URLS.userAdmin} />
                  <Route component={requireAuth(JobPostAdministration, ['HS', 'Nok', 'Index'])} path={URLS.jobpostsAdmin} />
                  <Route component={requireAuth(EventAdministration, ['HS', 'Promo', 'Nok', 'Index'])} path={URLS.eventAdmin} />
                  <Route component={requireAuth(NewsAdministration, ['HS', 'Promo', 'Nok', 'Index'])} path={URLS.newsAdmin} />

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
      </UserProvider>
    </MiscProvider>
  );
};

// eslint-disable-next-line no-console
console.log(
  '%cLaget av %cIndex',
  'font-weight: bold; font-size: 1rem;color: yellow;',
  'font-weight: bold; padding-bottom: 10px; padding-right: 10px; font-size: 3rem;color: yellow; text-shadow: 3px 3px 0 rgb(217,31,38), 6px 6px 0 rgb(226,91,14), 9px 9px 0 green, 12px 12px 0 rgb(5,148,68), 15px 15px 0 rgb(2,135,206), 18px 18px 0 rgb(4,77,145), 21px 21px 0 rgb(42,21,113)',
);
// eslint-disable-next-line no-console
console.log('%cSnoker rundt du? Det liker vi. Vi i Index ser alltid etter nye medlemmer.', 'font-weight: bold; font-size: 1rem;color: yellow;', '');

ReactDOM.render(<Application />, document.getElementById('root'));
