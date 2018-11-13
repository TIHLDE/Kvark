import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

// Text
import Text from '../../text/EventText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import Business from '@material-ui/icons/Business';
import Location from '@material-ui/icons/LocationOn';
import Time from '@material-ui/icons/AccessTime';

// Project Components
import MarkdownRenderer from '../MarkdownRenderer';

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gridTemplateRows: 'auto',
        gridGap: '10px',

        position: 'relative',

        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '100%',
            justifyContent: 'center',
        },
    },
    paper: {
        padding: 26,
        backgroundColor: 'white',
    },
    imageWrapper: {
        padding: 12,
        maxHeight: 456,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
    },
    title: {
        color: 'black',
        padding: 26,
    },
    content: {
        padding: 38,
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

        '@media only screen and (max-width: 800px)': {
            justifyContent: 'space-between',
        },
    },
    ml: {marginLeft: 10},
    mt: {marginTop: 10},
    mb: {marginBottom: 36},
};

const InfoContent = withStyles(styles)((props) => (
    <Grid className={props.classes.info} container direction='row' wrap='nowrap' alignItems='center' justify='flex-start'>
        {props.icon !== undefined && props.icon}
        <Typography className={props.icon ? props.classes.ml : ''} variant='subheading'>{props.label}</Typography>
    </Grid>
));

InfoContent.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string,
};

const JobPostRenderer = (props) => {
    const {classes} = props;
    const data = props.data || {};
    const deadline = moment(data.deadline, ['YYYY-MM-DD HH:mm'], 'nb');

    return (
        <div className={classes.grid} >
            <Paper className={classNames(classes.paper, classes.content)} square>
                <Typography className={classes.mb} variant='display1' gutterBottom><strong>{data.title}</strong></Typography>
                <MarkdownRenderer className={classes.mb} value={data.ingress || ''} />
                <MarkdownRenderer value={data.body || ''} />
            </Paper>
            <Paper className={classNames(classes.paper, classes.details)} square>
                <div className={classes.imageWrapper}>
                    <img className={classes.image} src={data.logo} alt={data.logo_alt} />
                </div>
                <Divider className={classes.mb} />
                <InfoContent icon={<Business />} label={<strong>{data.company}</strong>} />
                <InfoContent icon={<Time />} label={deadline.format('DD.MM.YYYY')} />
                <InfoContent icon={<Location />} label={data.location} />
                {data.price && <InfoContent icon={<Time />} label={data.price} />}
                {data.sign_up && <Button fullWidth className={classes.mt} variant='outlined' color='primary'>{Text.signUp}</Button>}
            </Paper>
        </div>
    );
};

JobPostRenderer.propTypes = {
    classes: PropTypes.object,

    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobPostRenderer);
