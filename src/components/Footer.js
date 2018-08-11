import React,{Component} from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';


const styles = {
    root: {
        backgroundColor: 'var(--tihlde-blaa)',
        color: 'white',
        padding: '100px',
    },
};

class Footer extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Typography variant='headline' color='inherit'>From Nettkom with 💖</Typography>
            </div>
        );
    }
};

Footer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Footer);
