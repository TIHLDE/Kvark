// React
import React, {Component} from 'react';
import URLS from '../../URLS';

// Serivce imports
import AuthService from '../../api/services/AuthService';

// Material-UI
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import ProfileContainer from './components/ProfileContainer';

const styles = (theme) => ({
    root: {
        paddingTop: '15px',
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gridTemplateAreas: "'leftSidePanel rightSidePanel' 'leftSidePanel rightSidePanel'",
        minHeight: '90vh',
        maxWidth: 1200,
        margin: '0 auto',
        
        
    },
    leftSidePanel: {
        gridArea: 'leftSidePanel',
    },
    rightSidePanel: {
        gridArea: 'rightSidePanel',
        
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
                        <Card className={classes.mainContent}> 
                            <div className={classes.leftSidePanel}>
                                <ProfileContainer onLogOut={this.logOut}/>
                            </div>
                            <div className={classes.rightSidePanel}>
                                Amigo 
                            </div>
                        </Card>
                    </div>
                      
            </Navigation>
        );
    }
}

export default withStyles(styles)(Profile);