// React
import React, {Component} from 'react';

// Material-UI
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// Project Components
import ProfileInfo from './ProfileInfo';

const styles = (theme) => ({
    card: {
        maxWidth: 345,
        minHeight: '100%',
    },
    media: {
        height: 250,
    },
    cardContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateAreas: "'infoHeader infoHeader' 'infoName infoInput' 'infoName infoInput'",
    },
   
});

class ProfileContainer extends Component {
  render() {
    const {classes} = this.props;
    return (
        <Card className={classes.card}>
           
                <CardMedia
                className={classes.media}
                image="https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1-744x744.jpg"
                title="Contemplative Reptile"
                />
                <CardContent >
                   <ProfileInfo/>
                </CardContent>
            
            <CardActions>
                <Button size="small" color="primary">
                    Endre profil instillinger
                </Button>
            </CardActions>
        </Card>
    )
  }
}

export default withStyles(styles)(ProfileContainer);