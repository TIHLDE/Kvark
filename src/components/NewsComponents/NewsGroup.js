import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import URLS from '../../URLS';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Project Components
import Link from '../Link';

const styles = theme => ({
    root: {
        height: '100%',
        maxHeight: '100%',

        '@media only screen and (max-width: 600px)': {
            height: 'auto',
            maxHeight: 'none',
            gridTemplateRows: 'auto auto',
            boxShadow: 'none',
        },
    },
    row: {
        
    },
    rowWrapper: {
        padding: 8,
        '@media only screen and (max-width: 600px)': {
            flexDirection: 'column',
            padding: 0,
        }
    },
    textContainer: {
        minHeight: 60,
        color: 'black',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        '@media only screen and (max-width: 600px)': {
            padding: '15px 15px 10px 15px',
        }
    },
    textPadding: {
        padding: '15px 15px 10px 15px',
    },
    text: {
        '@media only screen and (max-width: 600px)': {
            fontSize: '1.5rem',
        }
    },
    fade: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 20,
        backgroundColor: 'white',
    },
    image: {
        height: 300,
        width: '100%',
        objectFit: 'cover',

        '@media only screen and (max-width: 600px)': {
            height: 'auto',
            minHeight: 200,
            maxHeight: 250,
        },
    },
    smImage: {
        height: 92,
        width: '100%',
        objectFit: 'cover',
        maxHeight: 92,

        '@media only screen and (max-width: 800px)': {
            height: 114
        },

        '@media only screen and (max-width: 600px)': {
            height: 'auto',
            width: '100%',
            minHeight: 200,
            maxHeight: 250,
        },
    },
    lg: {
        overflow: 'hidden',
    },
    sm: {
        overflow: 'hidden',
        flex: '1 1 0',
        padding: 4,
        '@media only screen and (max-width: 600px)': {
            flex: '0 1 auto',
            padding: 0,
        }
    },
    item: {
        '@media only screen and (max-width: 600px)': {
            boxShadow: theme.shadows[1],
        }
    },
    gutterBottom: {
        '@media only screen and (max-width: 600px)': {
            marginBottom: 20,
        },
    },
});

const NewsItem = withStyles(styles)((props) => {
    const {classes, data} = props;
    return (
        <div className={classNames(classes.item, props.lg ? classes.lg : classes.sm, props.gutterBottom ? classes.gutterBottom : '')}>
            <Link to={URLS.news + props.id}>
            <img className={props.lg ? classes.image : classes.smImage} src={data.image} alt={data.imageAlt}/>
            <div className={classNames(classes.textContainer, props.padding ? classes.textPadding : '')}>
                <Typography className={classes.text} variant={props.lg ? 'headline' : 'body1'} color='inherit'>{data.title}</Typography>
                <div className={classes.fade} />
            </div>
            </Link>
        </div>
    );
});

NewsItem.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
    id: PropTypes.number,
    lg: PropTypes.bool,
    gutterBottom: PropTypes.bool,
}

class NewsGroup extends Component {
    
    render() {
        let {classes, data} = this.props;
        data = (data || []);
        const lg = (data.length > 0)? data[0] : {};
        const news = data.length > 4 ? data.slice(1, 4) : (data.length > 1)? data.slice(1, data.length) : [];
        
        return (
            <Paper className={classes.root} square elevation={1}>
                <NewsItem lg data={lg.data} gutterBottom id={lg.id} padding/>
                
                <div className={classes.row}>
                    <Grid className={classes.rowWrapper} container direction='row' wrap='nowrap'>
                        {news.map((value, index) => (
                            <NewsItem key={value.id} data={value.data} gutterBottom={index !== data.length - 1} id={value.id}/>
                        ))}
                    </Grid>
                </div>
            </Paper>
        );
    }
}

NewsGroup.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewsGroup);

