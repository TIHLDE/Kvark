import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

// Text Imports
import Text from '../../text/AboutText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

// Icons
import LandingHeader from '../../assets/img/LinkedInTihldeHeader.png';
import FitnessIcon from '@material-ui/icons/FitnessCenter';
import TerrainIcon from '@material-ui/icons/Terrain';
import LocalSeeIcon from '@material-ui/icons/LocalSee'

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import Icons from './components/Icons';

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
        maxWidth: 1200,
        margin: 'auto',
        '@media only screen and (max-width: 1200px)': {
            padding: '48px 0',
        }
    },
    topSection: {
        padding: '20px 48px 48px 48px',

        '@media only screen and (max-width: 1200px)': {
            padding: '12px 0px 48px 0px',
        }
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
        // 600px
        '@media only screen and (max-width: 860px)': {
            gridTemplateColumns: '1fr',
        }
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
                        <Banner
                            image={LandingHeader}
                            disableFilter='true'>
                            <Divider />
                        </Banner>
                    </div>

                    <div className={classes.smoke}>
                        <div className={classes.section}>
                            <Paper className={classes.container}>
                                <div className={classes.icons}>
                                    <Icons data={{
                                        title: "TurKom",
                                    }} icon={TerrainIcon} />
                                    <Icons data={{
                                        title: "Tihlde Pythons",
                                    }} icon={FitnessIcon} />
                                    <Icons data={{
                                        title: "Redaksjonen",
                                    }} icon={LocalSeeIcon} />
                                </div>
                            </Paper>
                        </div>
                    </div>

                    <div>
                        <div className={classes.section}>
                            <Typography className={classes.verticalMargin} variant='headline' color='inherit' align='center'>Kalender</Typography>

                        </div>
                    </div>

                    <div className={classes.smoke}>
                        <div className={classes.section}>
                            <Typography className={classes.verticalMargin} variant='headline' color='inherit' align='center'>Nyheter</Typography>

                            <Paper className={classes.miniMargin} square elevation={1}>
                            </Paper>
                        </div>
                    </div>

                    <div className={classes.section}>
                        <Typography className={classes.verticalMargin} variant='headline' color='inherit' align='center'>Kontakt Oss</Typography>
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
