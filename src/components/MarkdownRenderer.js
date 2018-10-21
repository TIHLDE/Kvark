import React from 'react';
import PropTypes from 'prop-types';

// External Imports
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';

const MarkdownRenderer = (props) => (
    <ReactMarkdown source={props.value} plugins={[breaks]} escapeHtml={false}/>
);

MarkdownRenderer.propTypes = {
    value: PropTypes.string.isRequired,
};

export default MarkdownRenderer;
