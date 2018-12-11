import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';

// External Imports
import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './ImageGallery.css';

const styles = {
    root: {
        height: '100%',
        maxHeight: '100%',
        position: 'relative',
    },
    gallery: {
       height: '100%',
    },
    actionButton: {
        position: 'absolute',
        bottom: 20, left: 0, right: 0,
        width: 200,
        margin: 'auto',
    }
};

class ImageGallery extends Component {

    constructor(props) {
        super(props);

        const {data} = props;
        let images = (data && data.images)? data.images : [];
        images = images.map((value) => (
            {original: value.image, thumbnail: value.image}
        ));

        this.state = {
            images: images,

            actionButtonFade: false,
        }
        this.gallery = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.data && this.props.data && prevProps.data.images !== this.props.data.images) {
            const {data} = this.props;
            let images = (data && data.images)? data.images : [];
            images = images.map((value) => (
                {original: value.image, thumbnail: value.image}
            ));
            this.setState({images: images});
        }
    }

    nextImage = (event) => {
        const index = this.gallery.current.state.currentIndex;
        this.gallery.current.slideToIndex(index+1);
    }

    onSlide = (currentIndex) => {
        this.setState({actionButtonFade: false});
        setTimeout(() => this.setState({actionButtonFade: true}), 200);
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
                    onSlide={this.onSlide}
                />
                <Grow in={this.state.actionButtonFade} timeout={{enter: 500, exit: 200}}>
                    <Button className={classes.actionButton} variant='raised' color='primary'>Hello</Button>
                </Grow>
            </Paper>
        );
    };
}

ImageGallery.propTypes = {
    data: PropTypes.object,
};

export default withStyles(styles)(ImageGallery);
