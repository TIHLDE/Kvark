import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Assets import
import SIT from '../../assets/img/sit.svg';
import NEXTTRON from '../../assets/img/Nextron.png';
import ACADEMICWORK from '../../assets/img/aw_logo_main_green.svg';
import FACEBOOK from '../../assets/icons/facebook.svg';
import TWITTER from '../../assets/icons/twitter.svg';
import INSTAGRAM from '../../assets/icons/instagram.svg';
import SNAPCHAT from '../../assets/icons/snapchat.svg';
import SLACK from '../../assets/icons/slack.svg';


const styles = {
    root: {
        position: 'relative',
        bottom: 0, left: 0, right: 0,

        backgroundColor: '#1b1b2d',
        padding: '40px 0px',
        display: 'grid',
        gridGap: '40px',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridTemplateAreas: "'Sponsorer OmTihlde SosialeMedier TihldeSupport'", //SosialeMedier
        gridTemplateRows: 'auto',
        justifyItems: 'center',
        color: 'white',
        textColor: 'white',
        boxShadow: '0px -2px 5px 0px rgba(0,0,0,0.1)',

        '@media only screen and (max-width: 900px)': {
            gridTemplateRows: 'auto auto',
            gridTemplateAreas: "'OmTihlde TihldeSupport' 'SosialeMedier Sponsorer'",
            gridTemplateColumns: 'auto auto',
        },

        '@media only screen and (max-width: 600px)': {
            gridTemplateRows: 'auto auto auto auto',
            gridTemplateAreas: "'TihldeSupport' 'OmTihlde' 'SosialeMedier' 'Sponsorer'",
            gridTemplateColumns: '100%',
        }
    },
    widthCheck: {
        height: '100%',
        width: '100%',
    },
    omTihlde: {
        gridArea: 'OmTihlde',
    },
    sponsorer: {
        gridArea: 'Sponsorer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    sosialeMedier: {
        gridArea: 'SosialeMedier',
    },
    sosialeMedierFlex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',

    },
    tihldeSupport: {
        gridArea: 'TihldeSupport',
        display: 'flex',
        flexDirection: 'column',
    },
    horSpacing: {
        marginBottom: 10,
    },
    a: {
        margin: '0 4px',
    }
};

class Footer extends Component {

    omTihlde = () => {
        const { classes } = this.props;
        return (
            <div className={classes.omTihlde}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>TIHLDE</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' >c/o IDI NTNU</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' >Sverres gate 14</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' >7012 Trondheim</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' >hs@tihlde.org</Typography>
            </div>
        )
    };

    sponsorer = () => {
        const { classes } = this.props;
        return (
            <div className={classes.sponsorer}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>Samarbeid</Typography>
                <img className={classes.horSpacing} src={ACADEMICWORK} alt="academicwork" width={80} />
                <img className={classes.horSpacing} src={SIT} alt="sit" width={80} />
                <img className={classes.horSpacing} src={NEXTTRON} alt="nextron" width={80} />
            </div>
        )
    };

    sosialeMedier = () => {
        const { classes } = this.props;
        return (
            <div className={classes.sosialeMedier}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>Sosiale medier</Typography>
                <div className={classes.sosialeMedierFlex}>
                    <a className={classes.a} href="https://www.facebook.com/tihlde/">
                        <img className={classes.horSpacing} src={FACEBOOK} alt="sit" width={40} />
                        {/*<i class="fab fa-facebook fa-3x"></i>*/}
                    </a>
                    <a className={classes.a} href="https://www.instagram.com/p/6Uh3rCBII7/">
                        <img className={classes.horSpacing} src={INSTAGRAM} alt="sit" width={40} />
                        {/*<i class="fab fa-instagram fa-3x"></i>*/}
                    </a>
                    <a className={classes.a} href="https://twitter.com/tihlde">
                        <img className={classes.horSpacing} src={TWITTER} alt="sit" width={40} />
                        {/*<i class="fab fa-twitter fa-3x"></i>*/}
                    </a>
                </div>
                <div className={classes.sosialeMedierFlex}>
                    <a className={classes.a} href="https://www.snapchat.com/add/tihldesnap">
                        <img className={classes.horSpacing} src={SNAPCHAT} alt="sit" width={40} />
                        {/*<i class="fab fa-snapchat-ghost fa-3x"></i>*/}
                    </a>
                    <a className={classes.a} href="https://tihlde.slack.com">
                        <img className={classes.horSpacing} src={SLACK} alt="sit" width={40} />
                        {/*<i class="fab fa-slack fa-3x"></i>*/}
                    </a>
                </div>
            </div>
        )
    };

    tihldeSupport = () => {
        const { classes } = this.props;
        return (
            <div className={classes.tihldeSupport}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='h5'>Support</Typography>
                <Button className={classes.horSpacing} variant='contained' color='primary' href='https://tihlde.org/secure/osticket/open.php'>Åpne en ny sak</Button>
                <Button className={classes.horSpacing} variant='contained' color='secondary' href='https://tihlde.org/secure/osticket/view.php'>Sjekk status for sak</Button>
                <Button className={classes.horSpacing} variant='contained' color='primary' href='https://goo.gl/forms/ATrwKEVybuDj4gis1'>Send tilbakemelding</Button>
            </div>
        )
    };


    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.sponsorer()}
                {this.omTihlde()}
                {this.sosialeMedier()}
                {this.tihldeSupport()}
            </div>
        );
    }
}

Footer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Footer);
