import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// Services
import AuthService from '../../api/services/AuthService';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Icons
import TIHLDELOGO from '../../assets/img/TIHLDE_LOGO.png';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Calender from './components/Calendar';
import URLS from '../../URLS';

const styles = {
    root: {
        minHeight: '100vh',
    },
    grid: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '15px',
        marginBottom: 40,

        '@media only screen and (max-width: 700px)': {
            gridTemplateColumns: '1fr',
        },
    },
    padding: {
        padding: 30,

        '@media only screen and (max-width: 700px)': {
            padding: 15,
        },
    },
    section: {
        padding: 48,
        maxWidth: 1000,
        margin: 'auto',
        '@media only screen and (max-width: 1200px)': {
            padding: '48px 0',
        },
    },
    topSection: {
        padding: 0,
        margin: 'unset',
        width: '100%',
        maxWidth: 'none',
        minHeight: '451px',
    },
    topInner: {
        margin: 'auto',
        maxWidth: '1000px',
        padding: '100px 15px',
        position: 'relative',
        zIndex: '20',
    },
    topSmallText: {
        color: 'white',
        margin: '10px auto',
        '@media only screen and (max-width: 800px)': {
            fontSize: '1.05rem',
        },
    },
    topTitleText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
    },
    topLogoContainer: {
        display: 'flex',
    },
    topLogo: {
        margin: '0 auto',
        width: '70vw',
        maxWidth: '450px',
        minWidth: '250px',
        objectFit: 'contain',
    },
    topButtonContainer: {
        margin: '20px auto 0',
        display: 'flex',
        justifyContent: 'center',
    },
    topButton: {
        color: '#2d4a7f',
        backgroundColor: 'white',
        margin: 'auto 10px',
    },
    topLink: {
        textDecoration: 'none',
    },
    topButtonSecondary: {
        color: 'white',
        textDecoration: 'none',
        margin: 'auto 10px',
    },
    verticalMargin: {
        marginTop: 30,
        marginBottom: 30,
    },
    bottomSpacing: {
        marginBottom: 10,
    },
    miniPadding: {
        padding: 10,
    },
    miniMargin: {
        margin: 4,
    },
    bottomItem: {
        gridColumn: 'span 2',

        '@media only screen and (max-width: 700px)': {
            gridColumn: 'span 1',
        },
    },
    smoke: {
        width: '100%',
        backgroundColor: '#Fefefe',
        marginTop: '-3px',
        zIndex: '25',
    },
    linkContainer: {
        marginBottom: 0,
        width: '100%',
        gridGap: 0,
    },
    icons: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        gridGap: '1px',
        '@media only screen and (max-width: 860px)': {
            gridTemplateColumns: '1fr',
        },
    },
    calendar: {
        justify: 'center',
        maxWidth: 500,
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
    },
    buttonDiv: {
    },
    margining: {
        marginTop: '2px',
        marginBottom: '20px',
    },
};

class NewLanding extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { classes } = this.props;
        return (
            <Navigation footer whitesmoke>
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <div className={classNames(classes.section, classes.topSection)}>
                        <div className="waveWrapper waveAnimation">
                            <div className={classes.topInner}>
                                <div className={classes.topLogoContainer} style={{display: 'flex'}}>
                                    <img className={classes.topLogo} src={TIHLDELOGO} alt='TIHLDE_LOGO' />
                                </div>
                                <Typography variant='h6' align='center' className={classes.topSmallText}>Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Drift av datasystemer og Digital samhandling ved NTNU</Typography>
                                {AuthService.isAuthenticated() ?
                                <div className={classes.topButtonContainer}>
                                    <Link to={URLS.profile} className={classes.topLink}><Button className={classes.topButton} variant='contained' color='inherit'>Min side</Button></Link>
                                    {/* <Link to={URLS.login} className={classes.topButtonSecondary} variant='contained' color='inherit'>Opprett bruker ></Link> */}
                                </div>
                                :
                                <div className={classes.topButtonContainer}>
                                    <Link to={URLS.login} className={classes.topLink}><Button className={classes.topButton} variant='contained' color='inherit'>Logg inn</Button></Link>
                                    <Link to={URLS.signup} className={classes.topButtonSecondary} variant='contained' color='inherit'>Opprett bruker &gt;</Link>
                                </div>
                                }
                            </div>
                            <div className="rain rain--far"></div>
                            <div className="rain rain--mid"></div>
                            <div className="rain rain--near"></div>


                            <div className="waveWrapperInner bgTop">
                                <div className="wave waveTop"></div>
                            </div>
                            <div className="waveWrapperInner bgMiddle">
                                <div className="wave waveMiddle"></div>
                            </div>
                            <div className="waveWrapperInner bgBottom">
                                <div className="wave waveBottom"></div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.smoke}>
                        <div className={classes.section}>
                            <Typography variant='h4' color="inherit" align="center" className={classes.margining} >Arrangementer</Typography>
                            <Calender className={classes.calendar}></Calender>
                        </div>
                    </div>
                </Grid>
            </Navigation>
        );
    }

};

NewLanding.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewLanding);
