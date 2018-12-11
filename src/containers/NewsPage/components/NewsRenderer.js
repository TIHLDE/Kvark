import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import Time from '@material-ui/icons/AccessTime';

// Project Components
import MarkdownRenderer from '../../../components/miscellaneous/MarkdownRenderer';

const styles = {
    root: {
        maxWidth: 1200,
        margin: 'auto',
        paddingTop: 20,
        marginBottom: 100,

        '@media only screen and (max-width: 600)': {
            paddingTop: 0,
        }
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: 'auto',
        gridGap: '5px',

        position: 'relative',
        overflow: 'hidden',

        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '100%',
            justifyContent: 'center',
        },
    },
    paper: {
        padding: 26,
    },
    image: {
        width: '100%',
        height: 'auto',
        maxHeight: 400,
        objectFit: 'cover',
    },
    titleWrapper: {
        padding: 26,
    },
    title: {
        color: 'black',
    },
    content: {
        padding: 26,
        '@media only screen and (max-width: 800px)': {
            order: 1,
        },
    },
    details: {
        padding: 26,
        '@media only screen and (max-width: 800px)': {
            order: 0,
        },
    },
    info: {
        width: 'auto',
        marginBottom: 10,
    },
    ml: {marginLeft: 10},
    mt: {marginTop: 10},
};

const InfoContent = withStyles(styles)((props) => (
    <Grid className={props.classes.info} container direction='row' wrap='nowrap' alignItems='center' justify='flex-end'>
        <Typography className={props.classes.mr} variant='body2'>Publisert:</Typography>
        <Typography className={props.classes.ml} variant='body2'>{props.label}</Typography>
    </Grid>
));

InfoContent.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string,
};

const EventRenderer = (props) => {
    const {classes, newsData} = props;
    const data = (newsData && newsData.data)? newsData.data : (newsData)? newsData : {};
    const lastUpdated = (newsData && newsData.updated_at)? newsData.updated_at : (data.updated_at)? data.updated_at : '';
    const start = moment(lastUpdated, ['YYYY-MM-DD HH:mm'], 'nb');

    return (
        <div className={classes.root}>
            <Paper square>
                <img className={classes.image} src={data.image} alt={data.image_alt} />
                <div className={classes.titleWrapper}>
                    <Typography className={classes.title} variant='display1' gutterBottom><strong>{data.title}</strong></Typography>
                    <Typography className={classes.title} variant='subheading'>{data.header}</Typography>
                </div>
                <Divider />
                <div className={classes.grid} >
                    <div className={classes.content}>
                        <MarkdownRenderer value={data.body || ''} />
                    </div>
                    <div className={classes.details}>
                        <InfoContent label={start.format('HH:mm DD.MM.YYYY')} />
                        {data.price && <InfoContent icon={<Time />} label={data.price} />}
                        {data.sign_up && <Button fullWidth className={classes.mt} variant='outlined' color='primary'>{Text.signUp}</Button>}
                    </div>
                </div>
            </Paper>
        </div>
    );
};

EventRenderer.propTypes = {
    classes: PropTypes.object,

    newsData: PropTypes.object,
};

export default withStyles(styles)(EventRenderer);