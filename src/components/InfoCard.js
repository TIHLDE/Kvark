import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
    paper: {
        padding: theme.spacing.unit,
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing.unit,
    },
});

const GroupCard = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <div>
            <Paper className={classes.paper}>
                <Typography variant='title'>{props.header}</Typography>
                <Typography variant='body2'>
                    {props.body}
                </Typography>
            </Paper>
        </div>
    );
});

GroupCard.propTypes = {
    header: PropTypes.string,
    body: PropTypes.string,
    classes: PropTypes.object,
};

export default withStyles(styles, {withTheme: true})(GroupCard);
