// React
import React, {Component} from 'react';
import URLS from '../../URLS';
import Link from 'react-router-dom/Link';

// Serivce imports
import AuthService from '../../api/services/AuthService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import ProfilePaper from './components/ProfilePaper';

const styles = (theme) => ({
    root: {
        minHeight: '100vh',
        width: '100%',
    },
    top: {
        height: '200px',
        backgroundImage: 'linear-gradient(90deg, #F0C27B, #4B1248)',
    },
    main: {
        maxWidth: 1000,
        margin: 'auto',
        position: 'relative',
    },
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
    topSpacing: {
        marginTop: 10,
    },
});

class Profile extends Component{

    constructor(){
        super();
        this.state = {
            isLoading: false,
        }
    }

    logOut = () => {
        this.setState({isLoading: true});
        AuthService.logOut();
        this.props.history.push(URLS.landing);
    }

    render(){
        const { classes } = this.props;
        return(
            <Navigation footer isLoading={this.state.isLoading}>
                <div className={classes.root}>
                    <div className={classes.top}>
                    
                    </div>
                    <div className={classes.main}>
                        { AuthService.isAuthenticated() ?
                            <ProfilePaper logOutMethod={this.logOut} />
                            :
                            <Paper className={classes.paper} square elevation={3}>
                                <Typography variant='h6'>Du må være logget inn for å se profilen din</Typography>
                                <Link to={URLS.login}><Button className={classes.topSpacing} variant='contained' color='primary'>Logg inn</Button></Link>
                            </Paper>
                        }
                    </div>
                </div>
            </Navigation>
        );
    }
}

export default withStyles(styles)(Profile);