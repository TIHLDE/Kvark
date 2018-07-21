import React, { Component } from 'react';

import Navigation from '../components/Navigation';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';



const styles = theme => ({
    container: {
        display: 'grid',
        maxWidth: '1200px',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: `${theme.spacing.unit * 3}px`,
        margin: '100px auto',
    },
    paper: {
        padding: theme.spacing.unit,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing.unit,
    },
    divider: {
        margin: `${theme.spacing.unit * 2}px 0`,
    },
});

class Companies extends Component {

    render() {
        const { classes } = this.props;

        return <Navigation>
                <div className={classes.container}>
                    <div style={{ gridColumnEnd: 'span 6' }}>
                        <Paper className={classes.paper}>
                            <Typography variant='headline'>Om thilde</Typography>
                        </Paper>
                    </div>
                </div>
            
        </Navigation>
    }

}

export default withStyles(styles)(Companies);