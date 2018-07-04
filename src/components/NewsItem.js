import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Images
import Eksamensfest from '../assets/img/Eksamensfest.jpg';

const styles = {
    root: {
       cursor: 'pointer',
    },
    media: {
        width: '100%',
        height: '75%',
    },
    text: {
        fontSize: '0.8em',
    },
};

// !!NB!! THIS IS JUST AN EXAMPLE AND SHOULD BE REPLACE WITH A BETTER COMPONENT

class NewsItem extends Component {

    render() {
        const {classes} = this.props;

        return (
            <Card className={classes.root}>
                <img className={classes.media} src={Eksamensfest} />
                <CardContent>
                    <Typography className={classes.text} align='center'><strong>Nå er det bare å glede seg!</strong></Typography>
                </CardContent>
            </Card>
        );
    }
}

NewsItem.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewsItem);
