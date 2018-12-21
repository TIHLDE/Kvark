import React from 'react';
import PropTypes from 'prop-types';

const Emoji = (props) => (
    <span
        className="emoji"
        role="img"
        style={{color: 'black'}}
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
    >
        {props.symbol}
    </span>
);

Emoji.propTypes = {
    label: PropTypes.string,
    symbol: PropTypes.string,
};

export default Emoji;