import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';


// Material UI Components
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// Icons
import TIHLDELOGO from '../assets/img/tihldeLogo.png';
import URLS from '../URLS';

// Project Components
import Link from './Link';

const styles = {
    top: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10,
        height: 56,
        backgroundColor: 'var(--tihlde-blaa)',
        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    item: {
        height: 56,
        color: 'var(--tihlde-blaa)',
    },
    companyButton: {
        color: 'white',
        backgroundColor: 'var(--tihlde-blaa)',
        boxSizing: 'border-box',
        border: '5px solid white',
    },
};

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
            <div className={classes.top}>
                <div style={{flexGrow: 1}}>
                    <Link to='/'>
                    <img src={TIHLDELOGO} alt='logo' height='30em'/>
                    </Link>
                </div>
            </div>
            <div>
                <ActionLink to={URLS.undergroups} label='Undergrupper'/>
                <ActionLink className={classes.companyButton} to={URLS.company} label='Bedrifter'/>
            </div>
        </Fragment>
    );
};

SidebarContent.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SidebarContent);
