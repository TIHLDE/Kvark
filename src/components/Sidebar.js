import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import URLS from '../URLS';

// Material UI Components
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// Project Components
import Link from './Link';

const styles = (theme) => ({
    root: {
        marginTop: 56,
        zIndex: 10000,

        '@media only screen and (min-width: 600px)': {
            marginTop: 64,
        },
    },
    item: {
        height: 56,
        color: 'var(--tihlde-blaa)',
    },
    companyButton: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
        boxSizing: 'border-box',
        border: '5px solid white',

        '&hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    menuButton: {
        color: 'white',
    },
});

const ActionLink = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <Fragment>
            <Link to={props.to}>
                <ListItem className={classNames(classes.item, props.className)} button color="inherit">
                    <Grid container direction='column' wrap='nowrap' alignItems='center' justify='space-between'>
                        <Typography variant='headline' align='center' color='inherit'>{props.label}</Typography>
                    </Grid>
                </ListItem>
            </Link>
            <Divider className={classes.divider}/>
        </Fragment>
    );
});

ActionLink.propTypes = {
    to: PropTypes.string.isRequired,
};

const SidebarContent = (props) => {
    const {classes} = props;

    return (
        <Fragment>
            <div className={classes.root}>
                <ActionLink to={URLS.about} label='Om TIHLDE'/>
                <ActionLink to={URLS.services} label='Tjenester'/>
                <ActionLink to={URLS.events} label='Arrangementer'/>
                <ActionLink to={URLS.newStudent} label='Ny student'/>
                <ActionLink to={URLS.jobposts} label='Annonser'/>
                <ActionLink to={URLS.company} label='Bedrifter'/>
                <ActionLink to={URLS.login} label='Logg inn'/>
            </div>
        </Fragment>
    );
};

SidebarContent.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SidebarContent);
