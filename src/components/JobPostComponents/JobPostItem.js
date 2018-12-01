import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

// Icons
import Calendar from '@material-ui/icons/CalendarToday';
import Location from '@material-ui/icons/LocationOn';
import Business from '@material-ui/icons/Business';
import TIHLDELOGO from '../../assets/img/tihlde_image.png';

const styles = {
    root: {
        height: 130,
        maxHeight: 130,
        padding: 16,
        position: 'relative',
        overflow: 'hidden',

        '@media only screen and (max-width: 600px)': {
            maxHeight: 'none',
            maxWidth: '100vw',
            overflow: 'hidden',
            minHeight: 150,
            height: 'auto',
        },
    },
    src: {
        objectFit: 'cover',
        padding: 4,
        border: '1px solid whitesmoke',
        height: 70,
        minWidth: 70,
        width: 70,
    },
    content: {
        marginLeft: 26,
        border: 6,
    },
    title: {
        color: '#3f444a',
        fontWeight: 'bold',
    },

    details: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: 'auto',
            padding: '10px 0',
        },
    },
    infoRoot: {
        width: 'auto',
    },
    info: {
        marginLeft: 10,
    },
    icon: {
        color: 'rbga(0,0,0,0.8)',
        height: 16,
        width: 16,
        margin: 0,
    },
    btn: {
        padding: 0,
    },
    expired: {
       color: 'rgba(0,0,0,0.3)',
    },
    filter: {
        filter: 'opacity(0.3)',
    },
};

const InfoContent = withStyles(styles)((props) => (
    <Grid className={props.classes.infoRoot} container direction='row' wrap='nowrap' alignItems='center'>
        {props.icon}
        <Typography className={props.classes.info} variant='subheading'>{props.label}</Typography>
    </Grid>
));

InfoContent.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string,
};

const JobPostItem = (props) => {
    const {classes, data} = props;
    const src = (data.image)? data.image : TIHLDELOGO;
    const start = moment(data.deadline, ['YYYY-MM-DD HH:mm'], 'nb');
    return (
        <ListItem className={classes.btn} button onClick={props.onClick}>
            <Grid className={classes.root} container direction='row' wrap='nowrap' alignItems='center'>
                <img className={classNames(classes.src, (data.expired)? classes.filter : '')} src={src} alt={data.title} />
                <Grid className={classes.content} container direction='column' wrap='nowrap'>
                    <Typography className={classNames(classes.title, (data.expired)? classes.expired : '')} variant='title' gutterBottom>
                        <strong>{data.title}</strong>
                    </Typography>
                    <div className={classNames(classes.details, data.expired ? classes.filter : '')}>
                        <InfoContent icon={<Business className={classes.icon}/>} label={data.company} />
                        <InfoContent icon={<Location className={classes.icon}/>} label={data.location} />
                        <InfoContent icon={<Calendar className={classes.icon}/>} label={start.format('DD.MM.YYYY')} />
                    </div>
                </Grid>
            </Grid>
        </ListItem>
    );
};

JobPostItem.propTypes = {
    classes: PropTypes.object,

    data: PropTypes.object,
    onClick: PropTypes.func,
};

export default withStyles(styles)(JobPostItem);
