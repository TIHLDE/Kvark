import React, {Component, useState, useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store/store';
import URLS from './URLS';
import GA from './analytics';
import COOKIE from './api/cookie';
import {THEME, THEME_OPTIONS} from './settings';
import ThemeStore from './themeStore';

// Theme
import {MuiThemeProvider} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {darkTheme, lightTheme} from './theme';
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
import ClassesCheatsheet from './containers/Cheatsheet/subContainers/Classes';
import FilesCheatsheet from './containers/Cheatsheet/subContainers/Files';
import EventRules from './containers/EventRules';
import MessageGDPR from './components/miscellaneous/MessageGDPR';

// The user needs to be authorized (logged in and member of an authorized group) to access these routes
const requireAuth = (OriginalComponent, accessGroups) => {
  class App extends Component {

    state = {
      isAuthenticated: AuthService.isAuthenticated(),
      isLoading: true,
      allowAccess: false,
    }

    componentDidMount() {
      UserService.isGroupMember().then((groups) => {
        accessGroups.forEach((group) => {
          switch (group.toLowerCase()) {
            case 'hs': if (groups.isHS) {
              this.setState({allowAccess: true});
            } break;
            case 'promo': if (groups.isPromo) {
              this.setState({allowAccess: true});
            } break;
            case 'nok': if (groups.isNok) {
              this.setState({allowAccess: true});
            } break;
            case 'devkom': if (groups.isDevkom) {
              this.setState({allowAccess: true});
            } break;
            default: break;
          }
        });
      }).finally(() => {
        this.setState({isLoading: false});
      });
    }
    render() {
      const {isAuthenticated, isLoading, allowAccess} = this.state;
      if (isLoading) {
        return <div>Autentiserer...</div>;
      }
      if (!isAuthenticated) {
        MiscService.setLogInRedirectURL(this.props.match.path);
        return <Redirect to={URLS.login} />;
      }
      if (allowAccess) {
        return <OriginalComponent {...this.props} />;
      } else {
        return <Redirect to={URLS.landing} />;
      }
    }
  }

  App.propTypes = {
    match: PropTypes.object,
  };

  return App;
};

const Application = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const automaticTheme = useMemo(() => prefersDarkMode ? darkTheme : lightTheme, [prefersDarkMode]);

  const [theme, setTheme] = useState(lightTheme);
  const updateTheme = (newThemeName) => {
    switch (newThemeName) {
      case THEME_OPTIONS.light: setTheme(lightTheme); break;
      case THEME_OPTIONS.automatic: setTheme(automaticTheme); break;
      case THEME_OPTIONS.dark: setTheme(darkTheme); break;
      default: setTheme(lightTheme); break;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateTheme(COOKIE.get(THEME)), [automaticTheme]);

  const themeStore = {
    theme: {get: theme, set: updateTheme},
  };

  return (
    <ThemeStore.Provider value={themeStore}>
      <Provider store={store}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            { GA.init() && <GA.RouteTracker /> }
            <Switch>
              <Route exact path='/' component={NewLanding} />
              <Route path={URLS.events.concat(':id/registrering')} component={EventRegistration} />
              <Route path={URLS.events.concat(':id/')} component={EventDetails} />
              <Route path={URLS.about} component={About} />
              <Route path={URLS.contactInfo} component={ContactInfo} />
              <Route path={URLS.events} component={Events} />
              <Route path={URLS.services} component={Services} />
              <Route path={URLS.company} component={Companies} />
              <Route path={URLS.newStudent} component={NewStudent} />
              <Route path={URLS.profile} component={Profile} />
              <Route path={URLS.jobposts.concat(':id/')} component={JobPostDetails} />
              <Route exact path={URLS.jobposts} component={JobPosts} />
              <Route path={URLS.laws} component={Laws} />
              <Route path={URLS.privacyPolicy} component={PrivacyPolicy} />
              <Route path={URLS.eventRules} component={EventRules} />
              <Route exact path={URLS.cheatsheet} component={Cheatsheet}/>
              <Route path={URLS.cheatsheet.concat(':studyId/:classId/')} component={FilesCheatsheet}/>
              <Route path={URLS.cheatsheet.concat(':studyId/')} component={ClassesCheatsheet}/>

              <Route exact path={URLS.admin} component={requireAuth(Admin, ['HS', 'Promo', 'Nok', 'Devkom'])} />
              <Route path={URLS.userAdmin} component={requireAuth(UserAdmin, ['HS', 'Devkom'])} />
              <Route path={URLS.jobpostsAdmin} component={requireAuth(JobPostAdministration, ['HS', 'Nok', 'Devkom'])} />
              <Route path={URLS.eventAdmin} component={requireAuth(EventAdministration, ['HS', 'Promo', 'Nok', 'Devkom'])} />

              <Route path={URLS.login} component={LogIn} />
              <Route path={URLS.forgotPassword} component={ForgotPassword} />
              <Route path={URLS.signup} component={SignUp} />

              <Route component={Http404} />

            </Switch>
            <MessageGDPR />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </ThemeStore.Provider>
  );
};

// eslint-disable-next-line no-console
console.log('Snoker rundt du? Det liker vi. Vi i DevKom ser alltid etter nye medlemmer.');

ReactDOM.render(<Application/>, document.getElementById('root'));
