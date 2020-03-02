// React
import React, { Component } from 'react';
import classNames from 'classnames';
import Link from 'react-router-dom/Link';
import URLS from '../../../URLS';

// API and store import
import UserService from '../../../api/services/UserService';
import NotificationService from '../../../api/services/NotificationService';


// Material-UI
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Badge from '@material-ui/core/Badge';

import Settings from '@material-ui/icons/Settings';
import DateRange from '@material-ui/icons/DateRange';
import CommentIcon from '@material-ui/icons/Comment';

import Skeleton from '@material-ui/lab/Skeleton';

// Components
import ProfileSettings from './ProfileSettings';
import ProfileEvents from './ProfileEvents';
import ProfileNotifications from './ProfileNotifications';
import MemberProof from './MemberProof';

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
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#fff',
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
        marginTop: '50px',
        marginBottom: 1,
        backgroundColor: 'white',
    },
    button: {
        margin: '15px auto 0px',
        color: 'white',
    },
    buttonLink: {
        width: 'fit-content',
        textDecoration: 'none',
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
            isLoading: true,
            modalShow: false,
        }
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    loadUserData = () => {
        UserService.getUserData().then((user) => {
            if (user) {
                user.notifications.reverse();
                this.setState({ userData: user });
            }
        }).catch(() => {
            
        }).then(() => {
            this.setState({isLoading: false});
        });
    }

    loadIsGroupMember = () => {
        UserService.isGroupMember().then((groups) => {
            if (groups.isHS || groups.isPromo || groups.isNok || groups.isDevkom) {
                this.setState({groupMember: true});
            }
        });
    }

    updateNotificationReadState = (id, newState) => {
        NotificationService.updateNotificationReadState(id, newState).then((data) => {
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
    closeEventModal = () => {
        this.setState({modalShow: false});
    }
    showEventModal = () => {
        this.setState({modalShow: true});
    }


    render() {
        const { classes } = this.props;
        const notifications = this.state.userData.notifications ? this.state.userData.notifications :  [];

        return (
            <div className={classes.paper}>
                {this.state.modalShow && this.state.userData &&
                    <MemberProof
                        onClose={this.closeEventModal}
                        userId={this.state.userData.user_id}
                        status={this.state.modalShow} />
                }
                <div className={classNames(classes.profileCircle)}>{ this.state.userData.first_name !== undefined ? (this.state.userData.first_name).substring(0,1) + '' + (this.state.userData.last_name).substring(0,1) : <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant="text" /> }</div>
                <Typography className={classes.textMargin} variant='h4'>{ this.state.userData.first_name !== undefined ? this.state.userData.first_name + ' ' + this.state.userData.last_name : <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant="text" width="75%" /> }</Typography>
                <Typography className={classes.textMargin} variant='subtitle1'>{ this.state.userData.email !== undefined ? this.state.userData.email : <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant="text" width="45%" /> }</Typography>
                <div className={classes.buttonsContainer}>
                    { this.state.groupMember && <Link to={URLS.admin} className={classNames(classes.button, classes.buttonLink)}><Button variant='contained' color='primary'>Admin</Button></Link> }
                    <Button className={classes.button} variant='contained' color='primary' onClick={this.showEventModal}>Medlemsbevis</Button>
                    <Button className={classNames(classes.logOutButton, classes.button)} variant='contained' color='inherit' onClick={this.handleLogOut}>Logg ut</Button>
                </div>
                <Tabs variant="fullWidth" scrollButtons="on" centered className={classes.tabs} value={this.state.tabViewMode} onChange={this.handleChange}>
                    <Tab id='0' icon={<DateRange />} label={<Hidden xsDown>Arrangementer</Hidden>} />
                    <Tab id='1' icon={
                        <Badge badgeContent={0} color="error">
                            <CommentIcon />
                        </Badge>
                    } label={<Hidden xsDown>Notifikasjoner</Hidden>} />
                    <Tab id='2' icon={<Settings />} label={<Hidden xsDown>Innstillinger</Hidden>} />
                </Tabs>
                {this.state.tabViewMode === 0 && <ProfileEvents/>}
                {this.state.tabViewMode === 1 && <ProfileNotifications updateNotificationReadState={this.updateNotificationReadState} isLoading={this.state.isLoading} messages={notifications} />}
                {this.state.tabViewMode === 2 && <ProfileSettings />}
            </div>
        );
    }
}

export default withStyles(styles)(ProfilePaper);