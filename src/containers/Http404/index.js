import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Imgs
import http404img from '../../assets/img/http404.gif';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = {
    root: {
        minHeight: '101vh',
        backgroundColor: '#fefefe',
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
        margin: '15px auto',
        maxWidth: '100px',
        textAlign: 'center',
    },
    textContainer: {
        margin: '15px auto',
    }
};

class Http404 extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { classes } = this.props;
        return (
            <Navigation footer whitesmoke className={classes.root}>
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <div className={classes.smoke}>,
                        <img src={http404img} alt="404" className={classes.img} />
                    </div>
                    <div className={classes.smoke}>
                        <h3>Denne siden finnes ikke :(</h3>
                        <Button className={classes.bottomSpacing} variant='contained' color='primary' href='#' onClick={() => {window.history.go(-1)}}>Tilbake</Button>
                        <p className={classes.textContainer}>Send oss gjerne en <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/e/1FAIpQLSfp8ZUm-GfzMla0Hg4AeX0iO8HME8ez7TttY2MgUfpC8MzBIQ/viewform">tilbakemelding</a> om du fulgte en gyldig lenke hit</p>
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
