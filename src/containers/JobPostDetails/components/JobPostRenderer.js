import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

// Text
import Text from '../../../text/JobPostText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import Business from '@material-ui/icons/Business';
import Location from '@material-ui/icons/LocationOn';
import Time from '@material-ui/icons/AccessTime';

// Project Components
import MarkdownRenderer from '../../../components/miscellaneous/MarkdownRenderer';

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gridTemplateRows: 'auto',
        gridGap: '20px',

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
        maxHeight: 454,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
    },
    title: {
        color: 'black',

        '@media only screen and (max-width: 600px)': {
            fontSize: '2rem',
        }
    },
    content: {
        padding: 38,
        paddingBottom: 60,
        '@media only screen and (max-width: 800px)': {
            order: 0,
        },
    },
    details: {
        padding: 26,
        '@media only screen and (max-width: 800px)': {
            order: 1,
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
    mb: {marginBottom: 32},
    emailLink: {
        color: 'var(--tihlde-blaa)',
        cursor: 'pointer',
    },
    tooltip: {
      top: '-75px !important',
      zIndex: 10002,
    },
};

const InfoContent = withStyles(styles)((props) => (
    <Grid className={classNames(props.className, props.classes.info)} container direction='row' wrap='nowrap' alignItems='center' justify='flex-start'>
        <Tooltip classes={{ popper: props.classes.tooltip }} title={props.title}>
          {props.icon}
        </Tooltip>
        <Typography className={props.icon ? props.classes.ml : ''} variant='subtitle1'>{props.label}</Typography>
    </Grid>
));

InfoContent.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.node,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
};

const goToLink = (link, toMail=false) => {
    if(toMail) {
        window.location.href = 'mailto:'.concat(link);
    } else {
        window.open(link, '_blank');
    }
}

const JobPostRenderer = (props) => {
    const {classes} = props;
    const data = props.data || {};
    const deadline = (data.deadline)? moment(data.deadline, ['YYYY-MM-DD HH:mm'], 'nb').format('DD.MM.YYYY') : Text.noDeadline;
    const publishedAt = moment(data.created_at, ['YYYY-MM-DD HH:mm'], 'nb');

    return (
        <div className={classes.grid} >
            <div>
                <Paper className={classNames(classes.paper, classes.content)} square elevation={1}>
                    <Typography variant='caption' gutterBottom>Publisert: {publishedAt.format('DD.MM.YYYY')}</Typography>
                    <Typography className={classNames(classes.title, classes.mb)} variant='h5' gutterBottom><strong>{data.title}</strong></Typography>
                    <MarkdownRenderer className={classes.mb} value={data.ingress || ''} />
                    <MarkdownRenderer value={data.body || ''} />
                </Paper>
            </div>
            <div>
                <Paper className={classNames(classes.paper, classes.details)} square elevation={1}>
                    <div className={classes.imageWrapper}>
                        <img className={classes.image} src={data.logo} alt={data.logo_alt} />
                    </div>

                    <Divider className={classes.mb} />
                    <InfoContent title="Bedrift" icon={<Business />} label={<strong>{data.company}</strong>} />
                    <InfoContent title="Søknadsfrist" icon={<Time />} label={deadline} />
                    <InfoContent title="Sted" className={classes.mb} icon={<Location />} label={data.location} />

                    {data.email &&
                        <Fragment>
                            <Divider className={classes.mb} />
                            <Typography variant='subtitle1'><strong>{Text.contact}</strong></Typography>
                            
                            <Typography 
                                className={classNames(classes.emailLink, classes.mb)}
                                onClick={() => goToLink(data.email, true)}
                                variant='caption'>
                            {data.email}
                            </Typography>
                        </Fragment>
                    }
                    
                    
                    <Divider className={classes.mb} />
                    {data.link && 
                        <Button 
                            onClick={() => goToLink(data.link)}
                            fullWidth
                            className={classes.mt}
                            variant='outlined'
                            color='primary'>
                            {Text.apply}
                        </Button>
                    }
                </Paper>
            </div>
        </div>
    );
};

JobPostRenderer.propTypes = {
    classes: PropTypes.object,

    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobPostRenderer);
