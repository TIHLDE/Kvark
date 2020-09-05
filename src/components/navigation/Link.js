import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const Link = (props) => {
  return (
    <RouterLink {...props} style={{ textDecoration: 'none', color: 'transparent' }}>
      {props.children}
    </RouterLink>
  );
};

Link.propTypes = {
  children: PropTypes.node,
};

export default Link;
