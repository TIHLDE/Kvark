import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Text Imports
import Text from '../text/AboutText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import DriftIcon from '../assets/img/instagram_icon.png';

// Project Components
import Navigation from '../components/Navigation';
import InfoCard from '../components/InfoCard';

const styles = {
    root: {
        minHeight: '100vh',
        maxWidth: 1200,
        margin: 'auto',
        marginBottom: 100,
    },
    grid: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '15px',

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
    bottomMargin: {
        marginBottom: 30,
    },
    bottomSpacing: {
        marginBottom: 10,
    },
};

class About extends Component {

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer>
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <Typography className={classes.padding} variant='display2' color='inherit'><strong>{Text.header}</strong></Typography>
                    <Typography className={classes.padding} variant='title'>{Text.subheader}</Typography>

                    <div className={classes.padding}>
                        <Typography className={classes.bottomSpacing} variant='display1' color='inherit' align='center'>Historie</Typography>
                        <Typography variant='subheading'>{Text.history}</Typography>
                        <Typography variant='subheading'>{Text.history2}</Typography>
                    </div>

                    <Typography className={classes.bottomMargin} variant='display1' color='inherit'>Undergrupper</Typography>
                    <div className={classes.grid}>
                        <InfoCard header='Drift' text={Text.drift} src={DriftIcon}/>
                        <InfoCard header='Sosialen' text={Text.social} src={DriftIcon}/>
                        <InfoCard header='Næringsliv og Kurs' text={Text.business} src={DriftIcon}/>
                        <InfoCard header='Promo' text={Text.promo} src={DriftIcon}/>
                    </div>
                </Grid>
            </Navigation>
        );
    }

};

About.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(About);
