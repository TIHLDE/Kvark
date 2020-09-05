import React from 'react';
import PropTypes from 'prop-types';

const Emoji = (props) => (
  <span aria-hidden={props.label ? 'false' : 'true'} aria-label={props.label ? props.label : ''} className='emoji' role='img' style={{ color: 'black' }}>
    {props.symbol}
  </span>
);

Emoji.propTypes = {
  label: PropTypes.string,
  symbol: PropTypes.string,
};

export default Emoji;
