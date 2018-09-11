import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {refactorDateString} from '../../utils';
import classNames from 'classnames';
import Parser from 'html-react-parser';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        margin: 'auto',
        width: '100%',
        maxWidth: 900,
        backgroundColor: '#ebebe',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
        maxHeight: 500,
        '@media only screen and (max-width: 600px)': {
            order: 0,
        },
    },
    title: {
        margin: '20px 0 10px 0',
        '@media only screen and (max-width: 800px)': {
            fontSize: '1em',
        },
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.7em',
            order: 1,
        },
    },
    subtitle: {
        margin: '5px 0',
        '@media only screen and (max-width: 800px)': {
            fontSize: '0.7em',
        },
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.5em',
            order: 2,
        },
    },
    caption: {
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.4em',
            order: 3,
        },
    },
    contentText: {
        fontSize: '0.55em',
        marginTop: 30,
        marginBottom: 100,
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.5em',
            order: 4,
        },
    },
    avatar: {
        borderRadius: 0,
        width: '50px',
        height: '50px',
    },
    text: {
        '@media only screen and (max-width: 800px)': {
            padding: '0 15px',
        },
    },
};

const NewsRenderer = (props) => {
    const {classes, newsData} = props;
    const data = (newsData && newsData.data)? newsData.data : (newsData)? newsData : {};
    const lastUpdated = (newsData && newsData.updated_at)? newsData.updated_at : (data.updated_at)? data.updated_at : '';
    
    return (
        <Grid className={classes.root} container direction='column' wrap='nowrap'>
            <Typography className={classNames(classes.text, classes.title)} variant='display2' color='inherit'>{data.title}</Typography>
            <Typography className={classNames(classes.text, classes.subtitle)} variant='title'>{data.header}</Typography>
            <Typography className={classNames(classes.text, classes.caption)} variant='body2' color='textSecondary'>Sist oppdatert: {refactorDateString(lastUpdated)}</Typography>
            <img className={classes.image} src={data.image} alt={data.image_alt}/> 
{/*             <Typography className={classNames(classes.text, classes.contentText)}>
                {data.body}
            </Typography> */}
            {Parser(data.body)}
        </Grid>
    );
};

NewsRenderer.propTypes = {
    classes: PropTypes.object,
    newsData: PropTypes.object,
};

export default withStyles(styles)(NewsRenderer);