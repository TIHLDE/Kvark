import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
    root: {
        zIndex: 10,
        height: 300,
    },
    wrapper: {
        width: 'auto',
        padding: 10,
    }
};

const Event = (props) => (
    <Fragment>
        <Divider/>
        <ListItem button disableGutters style={{padding: 3}}>
            {/* <div style={{width: 5, height: 40, backgroundColor: 'var(--tihlde-blaa)'}}></div> */}
            {/* <ListItemText primary={props.title} secondary={props.location} primaryTypographyProps={{variant: 'headline'}}/> */}
            <ListItemText>
                <Grid container direction='row' wrap='nowrap' alignItems='center'>
                    <Typography component='span' variant='headline'>{props.title}</Typography>
                    <Typography component='span' variant='subheading'>&nbsp; på {props.location}</Typography>
                </Grid>
            </ListItemText>
            <div>
                <Typography variant='subheading'>{props.date}</Typography>
                <Typography variant='caption'>{props.time}</Typography>
            </div>
        </ListItem>
    </Fragment>
);

Event.propTypes = {
    title: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
};

class EventList extends Component {

    render() {
        const {classes} = this.props;

        return (
            <Card className={classes.root} square={true}>
                <div className={classes.wrapper}>
                    <Grid container direction='row' wrap='nowrap'>
                        <Typography variant='title'>Arrangementer</Typography>
                    </Grid>
                    <List dense>
                        <Event title='Eksamensfest' location='kontoret' date='20/12' time='18:00'/>
                        <Event title='Generalforsamiling' location='U302' date='20/12' time='18:00'/>
                        <Event title='Immefest' location='Sukkerhuset' date='20/12' time='18:00'/>
                        <Event title='Fadderuke' location='over alt' date='20/12' time='18:00'/>
                        <Event title='Latex Kurs' location='over alt' date='20/12' time='18:00'/>
                    </List>
                </div>
            </Card>
        );
    }
};

EventList.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventList);
