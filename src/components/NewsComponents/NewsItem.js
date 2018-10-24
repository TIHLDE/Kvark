import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import URLS from '../../URLS';
import classNames from 'classnames';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Project Components
import Link from '../Link';

const styles = {
    card: {
        height: '100%',
        maxHeight: 300,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',

        '@media only screen and (max-width: 600px)': {
            height: 'auto',
            maxHeight: 'none',
        },
    },
    none: {
        minHeight: 200,
    },
    image: {
        height: 200,
        width: '100%',
        objectFit: 'cover',

        '@media only screen and (max-width: 600px)': {
            height: 'auto',
            minHeight: 200,
            maxHeight: 250,
        },
    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: 60,
        backgroundColor: 'white',
        color: 'black',
        alignItems: 'center',
        padding: '15px 15px 10px 15px',

        '@media only screen and (max-width: 600px)': {
            position: 'static',
        },
    },
    whitesmoke: {
        backgroundColor: 'whitesmoke',
    },
};

class NewsItem extends Component {

    render() {
        const {classes} = this.props;
        let {data} = this.props;
        data = (data)? data : {};

        let imageOrFallback = null;
        if (data && data.image) {
            imageOrFallback = <img className={classes.image} src={data.image} alt={data.imageAlt}/>;
        } else {
           imageOrFallback = <Typography className={classes.none} variant='title'>Missing Image</Typography>;
        }

        return (
            <Paper className={classNames(classes.card, (data && data.image)? '' : classes.whitesmoke, this.props.className)} square={true} elevation={1}>
                <Link to={URLS.news + this.props.id}>
                    {imageOrFallback}
                    <div className={classes.textContainer}>
                        <Typography variant='headline' color='inherit'>{data.title}</Typography>
                    </div>
                </Link>
            </Paper>
        );
    }
}

export default withStyles(styles)(NewsItem);
