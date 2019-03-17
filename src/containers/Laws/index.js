import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = {
    root: {
        maxWidth: 1200,
        margin: 'auto',
        padding: 12,
        paddingTop: 20,
    }
};

class Laws extends Component {

    render() {
        const {classes} = this.props;
        return (
            <Navigation>
                <div className={classes.root}>
                    TIHLDES LOVER
                </div>
            </Navigation>
        );
    }
}

export default withStyles(styles)(Laws);