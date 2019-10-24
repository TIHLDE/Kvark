// React
import React, { Component } from 'react';
import classNames from 'classnames';

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

// Components
import ProfileSettings from './ProfileSettings';

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
        backgroundColor: 'peru',
        fontSize: '65px',
        paddingTop: '50px',
        color: 'black',
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
        marginTop: '15px',
        backgroundColor: '#b20101',
        color: 'white',
    }
});

class ProfilePaper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabViewMode: 2,
            userData: {},
        }
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    loadUserData = () => {
        UserService.getUserData().then((user) => {
            if(user) {
                this.setState({userData: user});
            }
        });
    }

    componentDidMount() {
        this.loadUserData();
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
                <div className={classNames(classes.profileCircle)}>{ this.state.userData.first_name !== undefined && (this.state.userData.first_name).substring(0,1) + '' + (this.state.userData.last_name).substring(0,1) }</div>
                <Typography variant='h4'>{ this.state.userData.first_name !== undefined && this.state.userData.first_name + ' ' + this.state.userData.last_name }</Typography>
                <Typography variant='subtitle1'>{ this.state.userData.email !== undefined && this.state.userData.email }</Typography>
                <Button className={classes.button} variant='contained' color='inherit' onClick={this.handleLogOut}>Logg ut</Button>
                <Tabs variant="fullWidth" scrollButtons="on" centered className={classes.tabs} value={this.state.tabViewMode} onChange={this.handleChange}>
                    <Tab id='0' icon={<DateRange />} label={<Hidden xsDown>Arrangementer</Hidden>} />
                    <Tab id='1' icon={<FavoriteIcon />} label={<Hidden xsDown>Favoritter</Hidden>} />
                    <Tab id='2' icon={<Settings />} label={<Hidden xsDown>Innstillinger</Hidden>} />
                </Tabs>
                {this.state.tabViewMode === 0 && <Typography variant='subtitle1'>Under utvikling!</Typography> }
                {this.state.tabViewMode === 1 && <Typography variant='subtitle1'>Kommer senere!</Typography> }
                {this.state.tabViewMode === 2 && <ProfileSettings /> }
            </Paper>
        );
    }
}

export default withStyles(styles)(ProfilePaper);