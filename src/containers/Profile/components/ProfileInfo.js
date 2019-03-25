// React
import React, { Component } from 'react'

// Material-UI
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
   cardContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateAreas: "'infoHeader infoHeader' 'infoName infoInput' 'infoName infoInput'",
    },
    infoHeader: {
        gridArea: 'infoHeader',
    },
    infoName: {
        gridArea: "infoName",
    },
    infoInput: {
        gridArea: "infoInput",
    },
});

class ProfileInfo extends Component {
  render() {
      const {classes} = this.props;
    return (
      <div>
         <div className={classes.cardContent}>
            <div className={classes.infoHeader}>
                <Typography gutterBottom variant='h5'>
                    My Profile
                </Typography>
            </div>    
            <div className={classes.infoName}> 
                
                <Typography component="p" >
                    Name: 
                </Typography>
                <Typography component="p" >
                    Phone: 
                </Typography>
                <Typography component="p" >
                    Email: 
                </Typography>
                <Typography component="p" >
                    Tihlde Status: 
                </Typography>
            </div>
            <div className={classes.infoInput}>
                
                <Typography component="p">
                    Sigurd 
                </Typography>
                <Typography component="p">
                    +4712345678
                </Typography>
                <Typography component="p">
                    Email@Email.com 
                </Typography>
                <Typography component="p">
                    Frivilig 
                </Typography>
            </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ProfileInfo);