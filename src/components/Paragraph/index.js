import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Paragraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            style: {
                width: props.width || 'auto',
                height: props.height || 'auto',
                overflow: props.overflow || 'hidden',
                fontSize: props.fontSize || 'inherit',
                textAlign: props.textAlign || 'left',
            },
            text: props.text || 'Tekst mangler',
        };
    }

    render() {


        return (
            <p style={this.state.style} className='Paragraph'>
                {this.props.text}
            </p>
        );
    }
};

Paragraph.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    overflow: PropTypes.string,
    fontSize: PropTypes.string,
    textAlign: PropTypes.string,
    text: PropTypes.string,
};
