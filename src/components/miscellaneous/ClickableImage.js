import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';

// External Components
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const styles = {
    root: {
        cursor: 'pointer',
    },
};

class ClickableImage extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
        };
    }

    toggleOpen = () => {
        this.setState({open: !this.state.open});
    }

    render() {
        const {classes, className, image, alt, ...rest} = this.props;
        if (!image) {
            return null;
        }

        return (
            <Fragment>
                <img onClick={this.toggleOpen} className={classNames(classes.root,className)} src={image} alt={alt} {...rest} />
                {this.state.open && (
                    <Lightbox
                        mainSrc={image}
                        onCloseRequest={() => this.setState({ open: false })}/>
                )}
            </Fragment>
        );
    }
}

ClickableImage.propTypes = {
    classes: PropTypes.object,
    image: PropTypes.any,
    className: PropTypes.string,
    alt: PropTypes.string,
};

export default withStyles(styles)(ClickableImage);
