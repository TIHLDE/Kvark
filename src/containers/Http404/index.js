import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
        textAlign: 'center'
    },
    section: {
        padding: 48,
        maxWidth: 1200,
        margin: 'auto',
        '@media only screen and (max-width: 1200px)': {
            padding: '48px 0',
        },
    },
    verticalMargin: {
        marginTop: 30,
        marginBottom: 30,
    },
    button: {
        textDecoration: 'none',
        backgroundColor: '#1d448c',
        color: 'white',
        padding: '6px 6px 6px 6px',
        borderRadius: '5px',
        display: 'block',
        margin: 'auto',
        maxWidth: '100px',
        textAlign: 'center',
        marginTop: '15px',
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
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <div className={classes.smoke}>
                        <img src={http404img} alt="404" className={classes.img}/>
                    </div>
                    <div className={classes.smoke}>
                        <h3>Denne siden finnes ikke:(</h3>
                        <a href="javascript:history.go(-1);"><h4>Tilbake</h4></a>
                    </div>

                    <div className={classes.section}>
                        <Typography className={classes.verticalMargin} variant='h5' color='inherit' align='center'>Got feedback?</Typography>
                        <div>Gi oss gjerne en tilbakemelding om du fulgte en gyldig lenke hit</div>
                        <a className={classes.button} href="https://docs.google.com/forms/d/e/1FAIpQLSfp8ZUm-GfzMla0Hg4AeX0iO8HME8ez7TttY2MgUfpC8MzBIQ/viewform">Klikk her</a>
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
