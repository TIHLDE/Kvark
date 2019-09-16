// React
import React, {Component} from 'react';
import URLS from '../../URLS';

// Serivce imports
import AuthService from '../../api/services/AuthService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = (theme) => ({
    root: {
        paddingTop: '120px',

        maxWidth: 1200,
        width: '100%',
        display: 'flex',
        margin: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        AuthService.logOut().then((data) => {
            this.props.history.push(URLS.landing);
        });
    }

    render(){
        const { classes } = this.props;
        return(
            <Navigation footer isLoading={this.state.isLoading}>
                <div className={classes.root}>
                    <Typography variant='h5' gutterBottom>Work in progress!</Typography>
                    <Button  variant='contained' color='primary' onClick={this.logOut}>Log out</Button>
                </div>
            </Navigation>
        );
    }
}

export default withStyles(styles)(Profile);