import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import URLS from '../../../../URLS';

// Material UI Components
import Typography from '@material-ui/core/Typography';

// Project Components
import Link from '../../../../components/navigation/Link';

const styles = {
    root: {

    },
    content: {
        marginTop: 12,
        padding: 12,
    },
    imageWrappre: {

    },
    image: {
        width: '100%',
        height: 'auto',
        maxWidth: 700,
        objectFit: 'cover',
        '@media only screen and (max-width: 800px)': {
            maxWidth: 'none',
        }
    },
}

class NewsItem extends Component {

    render() {
        const data = this.props.data || {};
        const content = data.data || {};
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Link to={URLS.news.concat(data.id)}>
                    <div className={classes.imageWrapper}>
                        <img className={classes.image} src={content.image} alt={'asdf'} />
                    </div>
                    <div className={classes.content}>
                        <Typography variant='h5'>{content.h6}</Typography>
                        <Typography variant='caption'>{content.header}</Typography>
                    </div>
                </Link>
            </div>
        );
    }
}

NewsItem.propTypes = {
    data: PropTypes.object,
};

export default withStyles(styles)(NewsItem);