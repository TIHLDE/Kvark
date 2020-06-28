import React from 'react';
import PropTypes from 'prop-types';
import {render} from '@testing-library/react';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {lightTheme} from './theme';

const AllProviders = (props) => {
  const {children} = props;
  return (
    <MuiThemeProvider theme={lightTheme}>
      {children}
    </MuiThemeProvider>
  );
};

AllProviders.propTypes = {
  children: PropTypes.node,
};

const customRender = (ui, options) => render(ui, {wrapper: AllProviders, ...options});

export * from '@testing-library/react';
export {customRender as render};
