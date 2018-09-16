import React,{Component} from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';


const styles = {
    root: {
        backgroundColor: 'var(--tihlde-blaa)',
        padding: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridTemplateAreas: "'OmTihlde Sponsorer SosialeMedier TihldeSupport'",
        gridTemplateRows: 'auto',
        justifyItems: 'center',
        color: 'white',
        textColor: 'white',

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
    },
    sosialeMedier: {
        gridArea: 'SosialeMedier',
    },
    tihldeSupport: {
        gridArea: 'TihldeSupport',
    },
};

class Footer extends Component {

    omTihlde = () => {
        const { classes } = this.props;
        return (
            <div className={classes.omTihlde}>
                <Typography align='center' color='inherit' variant='headline'>TIHLDE</Typography>
                <Typography align='center' color='inherit' variant='body1'>c/o IDI NTNU</Typography>
                <Typography align='center' color='inherit' variant='body1'>Sverres gate 14</Typography>
                <Typography align='center' color='inherit' variant='body1'>7012 Trondheim</Typography>
                <Typography align='center' color='inherit' variant='body1'>hs@tihlde.org</Typography>
            </div>
        )
    };

    sponsorer = () => {
        const { classes } = this.props;
        return (
            <div className={classes.sponsorer}>
                <Typography align='center' color='inherit' variant='headline'>Sponsorer</Typography>
            </div>
        )
    };

    sosialeMedier = () => {
        const { classes } = this.props;
        return (
            <div className={classes.sosialeMedier}>
                <Typography align='center' color='inherit' variant='headline'>Sosiale medier</Typography>
            </div>
        )
    };

    tihldeSupport = () => {
        const { classes } = this.props;
        return (
            <div className={classes.tihldeSupport}>
                <Typography align='center' color='inherit' variant='headline'>Support</Typography>
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
