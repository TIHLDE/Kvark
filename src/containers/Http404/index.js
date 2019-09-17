import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';

// Imgs
import http404img from '../../assets/img/http404.gif';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = {
    root: {
        minHeight: '100vh',
    },
    img: {
        width: '100%',
        maxHeight: '70vh',
        objectFit: 'contain',
        paddingTop: '25px'
    },
    smoke: {
        width: '100%',
        backgroundColor: '#Fefefe',
    },
    centerAlignText: {
        textAlign: 'center'
    }
};

class Http404 extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer whitesmoke className={classes.root}>
                <Grid className={classes.root, classes.smoke} container direction='column' wrap='nowrap' alignItems='center'>
                    <div>
                        <img src={http404img} alt="404" className={classes.img}/>
                    </div>
                    <div className={classes.centerAlignText}>
                        <h2>Denne siden finnes ikke:(</h2>
                        <a href="javascript:history.go(-1);"><h2>Tilbake</h2></a>
                    </div>
                </Grid>
            </Navigation>
        );
    }

};

Http404.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Http404);
