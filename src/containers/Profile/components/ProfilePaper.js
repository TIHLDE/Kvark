// React
import React, { Component } from 'react';
import classNames from 'classnames';
import Link from 'react-router-dom/Link';
import URLS from '../../../URLS';

// API and store import
import UserService from '../../../api/services/UserService';


// Material-UI
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Settings from '@material-ui/icons/Settings';
import DateRange from '@material-ui/icons/DateRange';
import FavoriteIcon from '@material-ui/icons/Favorite';

import Skeleton from '@material-ui/lab/Skeleton';

// Components
import ProfileSettings from './ProfileSettings';
import ProfileEvents from './ProfileEvents';

const styles = (theme) => ({
    paper: {
        width: '90%',
        maxWidth: 750,
        margin: 'auto',
        position: 'relative',
        left: 0,
        right: 0,
        top: '-60px',
        padding: '28px',
        paddingTop: '110px',
        textAlign: 'center',
    },
    profileCircle: {
        borderRadius: '50%',
        backgroundImage: 'linear-gradient(90deg, #DA4453, #89216B)',
        fontSize: '65px',
        paddingTop: '50px',
        color: 'white',
        height: '200px',
        width: '200px',
        textAlign: 'center',
        margin: 'auto',
        position: 'absolute',
        left: '0',
        right: '0',
        top: '-100px',
    },
    profileCircleImage: {
        backgroundImage: 'url(https://thenypost.files.wordpress.com/2019/09/takes-donald-trump.jpg?quality=90&strip=all&w=618&h=410&crop=1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#00000000',
        userSelect: 'none',
    },
    tabs: {
        marginTop: '10px',
        marginBottom: 1,
        backgroundColor: 'white',
    },
    button: {
        margin: '15px auto 0px',
        color: 'white',
    },
    logOutButton: {
        backgroundColor: '#b20101',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    skeleton: {
        animation: 'animate 1.5s ease-in-out infinite',
    },
    skeletonText: {
        margin: '4px auto',
    },
    textMargin: {
        margin: '2px auto',
    },
    skeletonCircle: {
        width: '110px',
        margin: '45px',
        marginTop: '2px',
        height: '90px',
    },
});

class ProfilePaper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabViewMode: 0,
            userData: {},
            groupMember: false,
        }
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    loadUserData = () => {
        UserService.getUserData().then((user) => {
            if (user) {
                this.setState({ userData: user });
            }
        });
    }

    loadIsGroupMember = () => {
        UserService.isGroupMember().then((groups) => {
            if (groups.isHS || groups.isPromo || groups.isNok || groups.isDevkom) {
                this.setState({groupMember: true});
            }
        });
    }

    componentDidMount() {
        this.loadUserData();
        this.loadIsGroupMember();
    }

    handleLogOut = () => {
        this.props.logOutMethod();
    }

    handleChange(event, newValue) {
        this.setState({ tabViewMode: newValue });
    }


    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper} square elevation={3}>
                <div className={classNames(classes.profileCircle)}>{ this.state.userData.first_name !== undefined ? (this.state.userData.first_name).substring(0,1) + '' + (this.state.userData.last_name).substring(0,1) : <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant="text" /> }</div>
                <Typography className={classes.textMargin} variant='h4'>{ this.state.userData.first_name !== undefined ? this.state.userData.first_name + ' ' + this.state.userData.last_name : <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant="text" width="75%" /> }</Typography>
                <Typography className={classes.textMargin} variant='subtitle1'>{ this.state.userData.email !== undefined ? this.state.userData.email : <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant="text" width="45%" /> }</Typography>
                <div className={classes.buttonsContainer}>
                    { this.state.groupMember && <Link to={URLS.admin}><Button className={classes.button} variant='contained' color='primary'>Admin</Button></Link> }
                    <Button className={classNames(classes.logOutButton, classes.button)} variant='contained' color='inherit' onClick={this.handleLogOut}>Logg ut</Button>
                </div>
                <Tabs variant="fullWidth" scrollButtons="on" centered className={classes.tabs} value={this.state.tabViewMode} onChange={this.handleChange}>
                    <Tab id='0' icon={<DateRange />} label={<Hidden xsDown>Arrangementer</Hidden>} />
                    <Tab id='1' icon={<FavoriteIcon />} label={<Hidden xsDown>Favoritter</Hidden>} />
                    <Tab id='2' icon={<Settings />} label={<Hidden xsDown>Innstillinger</Hidden>} />
                </Tabs>
                {this.state.tabViewMode === 0 && <ProfileEvents/>}
                {this.state.tabViewMode === 1 && <Typography variant='subtitle1'>Kommer senere!</Typography>}
                {this.state.tabViewMode === 2 && <ProfileSettings />}
            </Paper>
        );
    }
}

export default withStyles(styles)(ProfilePaper);