// React
import React, {Component} from 'react';


// Material-UI
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';

// Project Components
import Navigation from '../components/Navigation';
import ProfileContainer from '../components/ProfileContainer';



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
class MyProfile extends Component{
    render(){
        const { classes } = this.props;
        return(
            <Navigation footer>
                    <div className={classes.root}>
                        <Card className={classes.mainContent}> 
                            <div className={classes.leftSidePanel}>
                                <ProfileContainer/>
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

export default withStyles(styles)(MyProfile);