import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { Route } from 'react-router-dom';

function GoogleAnalytics(props) {
  const { location } = props;

  useEffect(() => {
    logPageChange(location.pathname);
  }, [location]);

  const logPageChange = (pathname) => {
    const page = pathname;
    const { location } = window;
    ReactGA.set({
      page,
      location: `${location.origin}${page}`,
    });
    ReactGA.pageview(page);
  };

  return null;
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

const event = (category, action, label = null) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

export default {
  GoogleAnalytics,
  RouteTracker,
  init,
  event,
};
