import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import {Route} from 'react-router-dom';

class GoogleAnalytics extends Component {
  componentDidMount() {
    this.logPageChange(
        this.props.location.pathname,
    );
  }

  componentDidUpdate({location: prevLocation}) {
    const {location: {pathname}} = this.props;
    const isDifferentPathname = pathname !== prevLocation.pathname;

    if (isDifferentPathname) {
      this.logPageChange(pathname);
    }
  }

  logPageChange(pathname) {
    const page = pathname;
    const {location} = window;
    ReactGA.set({
      page,
      location: `${location.origin}${page}`,
      ...this.props.options,
    });
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}

GoogleAnalytics.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  options: PropTypes.object,
};

const RouteTracker = () => <Route component={GoogleAnalytics} />;

const init = (options = {}) => {
  // Different analytics id in prod and dev
  const isInProduction = process.env.NODE_ENV === 'production';

  if (isInProduction) {
    ReactGA.initialize('UA-151173158-2');
  } else {
    ReactGA.initialize('UA-151173158-1');
  }

  return true;
};

export default {
  GoogleAnalytics,
  RouteTracker,
  init,
};
