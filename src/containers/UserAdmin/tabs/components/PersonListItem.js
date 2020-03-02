import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';

// Icons
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

const styles = {
    root: {
        padding: 16,
        position: 'relative',
        overflow: 'hidden',

        gridAutoFlow: 'column',
        display: 'grid',
        gridGap: '10px',
        width: '100%',
        textAlign: 'left',

        '@media only screen and (max-width: 600px)': {
            maxHeight: 'none',
            maxWidth: '100vw',
            overflow: 'hidden',
            height: 'auto',
            gridAutoFlow: 'row',
        },
    },
    activated: {
        gridTemplateColumns: 'auto 1fr auto auto 48px',
        gridTemplateRows: '1fr',

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto 1fr auto auto auto',
            gridGap: '0',
            textAlign: 'center',
        },
    },
    notActivated: {
        gridTemplateColumns: 'auto 1fr auto auto auto 96px',
        gridTemplateRows: '1fr',

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto 1fr auto auto auto auto auto',
            gridGap: '0',
            textAlign: 'center',
        },
    },
    title: {
        color: '#000000',
    },
    id: {
        minWidth: '65px',
    },
    btn: {
        padding: 0,
    },
    activateButton: {
        color: 'green',
        width: '48px',
        margin: 'auto',
    },
    deactivateButton: {
        color: '#b20101',
        width: '48px',
        margin: 'auto',
    },
};

const getStudy = (i) => {
    switch (i) {
        case 1: return 'Dataing';
        case 2: return 'DigFor';
        case 3: return 'DigInc';
        case 4: return 'DigSam';
        case 5: return 'Drift';
        default: return '?';
    }
};
const getClass = (i) => {
    switch (i) {
        case 1: return '1. klasse';
        case 2: return '2. klasse';
        case 3: return '3. klasse';
        case 4: return '4. klasse';
        case 5: return '5. klasse';
        default: return '?';
    }
};

const PersonListItem = (props) => {
    const {classes, data, isMember} = props;
    return (
        <ListItem className={classes.btn} onClick={props.onClick}>
            {isMember ?
            <Grid className={classNames(classes.root, classes.activated)} container direction='row' wrap='nowrap' alignItems='center'>
                <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'>{data.user_id}</Typography>
                <Typography className={classes.title} variant='subtitle1'><strong>{data.first_name + ' ' + data.last_name}</strong></Typography>
                <Typography className={classes.title} variant='subtitle1'><Hidden smUp>Studie: </Hidden>{getStudy(data.user_study)}</Typography>
                <Typography className={classes.title} variant='subtitle1'><Hidden smUp>Klasse: </Hidden>{getClass(data.user_class)}</Typography>
                <IconButton className={classes.deactivateButton} onClick={() => props.handleDelete(data.user_id)}><DeleteIcon /></IconButton>
            </Grid>
            :
            <Grid className={classNames(classes.root, classes.notActivated)} container direction='row' wrap='nowrap' alignItems='center'>
                <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'>{data.user_id}</Typography>
                <Typography className={classes.title} variant='subtitle1'><strong>{data.first_name + ' ' + data.last_name}</strong></Typography>
                <Typography className={classes.title} variant='subtitle1'><Hidden smUp>Studie: </Hidden>{getStudy(data.user_study)}</Typography>
                <Typography className={classes.title} variant='subtitle1'><Hidden smUp>Klasse: </Hidden>{getClass(data.user_class)}</Typography>
                <Typography className={classes.title} variant='subtitle1'><Hidden smUp>Vipps: </Hidden>{data.vipps * 120}</Typography>
                <div>
                    <IconButton className={classes.activateButton} onClick={() => props.handleActivate(data.user_id)}><ThumbUpIcon /></IconButton>
                    <IconButton className={classes.deactivateButton} onClick={() => props.handleDelete(data.user_id)}><DeleteIcon /></IconButton>
                </div>
            </Grid>
            }
        </ListItem>
    );
};

PersonListItem.propTypes = {
    classes: PropTypes.object,

    data: PropTypes.object,
    onClick: PropTypes.func,
    handleActivate: PropTypes.func,
    handleDelete: PropTypes.func,
};

export default withStyles(styles)(PersonListItem);
