import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {
    render() {
        return (
            <header className={this.props.className}>
                <div className={this.props.textClassName}>
                    {this.props.text}
                </div>
                {this.props.logo}
                {this.props.children}
            </header>
        );
    }
}

Header.defaultProps = {
    className: 'app-header',
    textClassName: 'app-header',
};

Header.propTypes = {
    className: PropTypes.string,
    textClassName: PropTypes.string,
    text: PropTypes.string,
    logo: PropTypes.any,
    children: PropTypes.any,
};
