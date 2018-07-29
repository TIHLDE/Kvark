import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Link from 'react-router-dom/Link';

// Material UI Components
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
    top: {
        height: 56,
        backgroundColor: 'var(--tihlde-blaa)',
    },
}

const SidebarContent = (props) => {
    const {classes} = props;

    return (
        <Fragment>
            <div className={classes.top}>
                
            </div>
            <div>
                <Link to='/undergrupper/' style={{ textDecoration: 'none' }}>
                    <ListItem button color="inherit">
                        <ListItemText primary='Undergrupper'/>
                    </ListItem>
                </Link>
                <Link to='/bedrifter/' style={{ textDecoration: 'none' }}>
                    <ListItem button color="inherit">
                    <ListItemText primary='Bedrifter'/>
                    </ListItem>
                </Link>
            </div>
        </Fragment>
    );
};

SidebarContent.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SidebarContent);
