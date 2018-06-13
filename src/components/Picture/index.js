import React, {Fragment, Component} from 'react';
import PropTypes from 'prop-types';

import './Picture.css';

export default class Picture extends Component {
    render() {
        let className = this.props.className || '';
        switch (this.props.type) {
            case 'circular':
                className += ' Circular';
                break;
            case 'normal':
            default:
                className += ' Normal';
                break;
        }

        return (
            <Fragment>
                <img src={this.props.src}
                    alt={this.props.alt}
                    className={className}
                    width={this.props.width}
                    height={this.props.height}
                />
            </Fragment>
        );
    }
}

Picture.defaultProps = {
    type: 'normal',
};

Picture.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    type: PropTypes.oneOf(['circular', 'normal']),
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
};

