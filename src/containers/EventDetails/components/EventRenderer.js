import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';

// Text
import Text from '../../../text/EventText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import Calendar from '@material-ui/icons/CalendarToday';
import Location from '@material-ui/icons/LocationOn';
import Time from '@material-ui/icons/AccessTime';

// Project Components
import MarkdownRenderer from '../../../components/miscellaneous/MarkdownRenderer';

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
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
        maxHeight: 456,
        objectFit: 'cover',
    },
    title: {
        color: 'black',
        padding: 26,
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

        '@media only screen and (max-width: 800px)': {
            justifyContent: 'space-between',
        },
    },
    ml: {marginLeft: 10},
    mt: {marginTop: 10},
};

const InfoContent = withStyles(styles)((props) => (
    <Grid className={props.classes.info} container direction='row' wrap='nowrap' alignItems='center' justify='flex-start'>
        {props.icon}
        <Typography className={props.classes.ml} variant='subtitle1'>{props.label}</Typography>
    </Grid>
));

InfoContent.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string,
};

const EventRenderer = (props) => {
    const {classes, data} = props;
    const description = data.description || '';
    const start = moment(data.start, ['YYYY-MM-DD HH:mm'], 'nb');

    return (
        <Paper className={classes.img} square>
            <img className={classes.image} src={data.image} alt={data.image_alt} />
            <Typography className={classes.title} variant='h5'><strong>{data.title}</strong></Typography>
            <Divider />
            <div className={classes.grid} >

                <div className={classes.details}>
                    <InfoContent icon={<Calendar />} label={start.format('DD.MM.YYYY')} />
                    <InfoContent icon={<Time />} label={start.format('HH:mm')} />
                    <InfoContent icon={<Location />} label={data.location} />
                    {data.price && <InfoContent icon={<Time />} label={data.price} />}
                    {data.sign_up && <Button fullWidth className={classes.mt} variant='outlined' color='primary'>{Text.signUp}</Button>}
                </div>
                <div className={classes.content}>
                    <MarkdownRenderer value={description} />
                </div>
            </div>
        </Paper>
    );
};

EventRenderer.propTypes = {
    classes: PropTypes.object,

    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventRenderer);
