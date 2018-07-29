import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Paper from '@material-ui/core/Paper';

// External Imports
import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './ImageGallery.css';

const styles = {
    root: {
        height: '100%',
        maxHeight: '100%',
    },
    gallery: {
       height: '100%',
    },
};

class ImageGallery extends Component {

    constructor() {
        super();
        this.gallery = React.createRef();
    }

    nextImage = (event) => {
        console.log(this.gallery);
        console.log(event);
        const index = this.gallery.current.state.currentIndex;
        this.gallery.current.slideToIndex(index+1);
        console.log(index);
    }

    render() {
        const {data, classes} = this.props;
        let images = (data && data.images)? data.images : [];
        images = images.map((value) => (
            {original: value.image, thumbnail: value.image, height: '200px'}
        ));

        return (
            <Paper className={classes.root} square>
                <ReactImageGallery
                    ref={this.gallery}
                    className={classes.gallery}
                    additionalClass={classes.gallery}
                    items={images}
                    showFullscreenButton={false}
                    showThumbnails={false}
                    showNav={false}
                    showPlayButton={false}
                    autoPlay={true}
                    onClick={this.nextImage}
                />
            </Paper>
        );
    };
}

ImageGallery.propTypes = {

};

export default withStyles(styles)(ImageGallery);
