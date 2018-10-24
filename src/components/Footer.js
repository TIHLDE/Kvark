import React,{Component} from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Assets import
import SIT from '../assets/img/sit.png';
import NEXTTRON from '../assets/img/Nextron.png';

import FACEBOOK from '../assets/icons/facebook.svg';
import TWITTER from '../assets/icons/twitter.svg';
import INSTAGRAM from '../assets/icons/instagram.svg';


const styles = {
    root: {
        backgroundColor: '#3B3B3B',
        padding: '40px 0px',
        display: 'grid',
        gridGap: '40px',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridTemplateAreas: "'OmTihlde Sponsorer SosialeMedier TihldeSupport'", //SosialeMedier
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
       /*  justifyContent: 'space-around', */
    },
    sosialeMedier: {
        gridArea: 'SosialeMedier',
    },
    sosialeMedierFlex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tihldeSupport: {
        gridArea: 'TihldeSupport',
        display: 'flex',
        flexDirection: 'column',
        /* justifyContent: 'space-around', */
    },
    horSpacing: {
        marginBottom: 10,
    },
};

class Footer extends Component {

    omTihlde = () => {
        const { classes } = this.props;
        return (
            <div className={classes.omTihlde}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='headline'>TIHLDE</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='body1'>c/o IDI NTNU</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='body1'>Sverres gate 14</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='body1'>7012 Trondheim</Typography>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='body1'>hs@tihlde.org</Typography>
            </div>
        )
    };

    sponsorer = () => {
        const { classes } = this.props;
        return (
            <div className={classes.sponsorer}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='headline'>Sponsorer</Typography>
                <img className={classes.horSpacing} src={SIT} alt="sit" width={80}/>
                <img className={classes.horSpacing} src={NEXTTRON} alt="nextron" width={80}/>
            </div>
        )
    };

    sosialeMedier = () => {
        const { classes } = this.props;
        return (
            <div className={classes.sosialeMedier}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='headline'>Sosiale medier</Typography>
                <div className={classes.sosialeMedierFlex}>
                    <a href="https://www.facebook.com/tihlde/">
                        <img src={FACEBOOK} alt="facebook" width={40}/>
                    </a>
                    <a href="https://twitter.com/tihlde">
                        <img src={INSTAGRAM} alt="instagram" width={40}/>
                    </a>
                    <a href="https://www.instagram.com/p/6Uh3rCBII7/">
                        <img src={TWITTER} alt="twitter" width={40}/>
                    </a>
                </div>
            </div>
        )
    };

    tihldeSupport = () => {
        const { classes } = this.props;
        return (
            <div className={classes.tihldeSupport}>
                <Typography className={classes.horSpacing} align='center' color='inherit' variant='headline'>Support</Typography>
                <Button className={classes.horSpacing} variant='contained' color='primary' href='https://tihlde.org/secure/osticket/open.php'>Open new ticket</Button>
                <Button className={classes.horSpacing} variant='contained' color='secondary' href='https://tihlde.org/secure/osticket/view.php'>Check ticket status</Button>
            </div>
        )
    };


    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                {this.omTihlde()}
                {this.sponsorer()}
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
