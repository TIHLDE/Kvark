import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Text Imports
import Text from '../../text/AboutText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Icons
import SocialIcon from '../../assets/icons/social.svg';
import BusinessIcon from '../../assets/icons/business.svg';
import OperationIcon from '../../assets/icons/operations.svg';
import PromoIcon from '../../assets/icons/promo.svg';
import OrgMap from '../../assets/img/orgMap.png';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import ClickableImage from '../../components/miscellaneous/ClickableImage';
import Banner from '../../components/layout/Banner';

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
};

class About extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer whitesmoke>
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <div className={classNames(classes.section, classes.topSection)}>
                        <Banner
                            image='https://images.pexels.com/photos/220351/pexels-photo-220351.jpeg?auto=compress&cs=tinysrgb&h=350'
                            text={Text.subheader}
                            title={Text.header}/>
                    </div>

                    <div className={classes.smoke}>
                        <div className={classes.section}>
                            <Typography className={classes.verticalMargin} variant='display1' color='inherit' align='center'>Undergrupper</Typography>
                            <div className={classNames(classes.grid, classes.smoke)}>
                                <InfoCard header='Drift' text={Text.drift} src={OperationIcon}/>
                                <InfoCard header='Sosialen' text={Text.social} src={SocialIcon}/>
                                <InfoCard header='Næringsliv og Kurs' text={Text.business} src={BusinessIcon}/>
                                <InfoCard header='Promo' text={Text.promo} src={PromoIcon}/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={classes.section}>
                            <Typography className={classes.verticalMargin}variant='display1' color='inherit' align='center'>Komitéer</Typography>
                            <div className={classes.grid}>
                                <InfoCard header='Jubkom' text={Text.jubkom} subheader='Opptak' subText={Text.jubkom2} justifyText/>
                                <InfoCard header='Netkom' text={Text.netkom} subheader='Opptak' subText={Text.netkom2} justifyText/>
                                <InfoCard header='Turkom' text={Text.turkom} subheader='Opptak' subText={Text.turkom2} justifyText/>
                                <InfoCard header='Koskom' text={Text.kosekom} subheader='Opptak' subText={Text.kosekom2} justifyText/>
                          </div>
                        </div>
                    </div>


                    <div className={classes.smoke}>
                        <div className={classes.section}>
                            <Typography className={classes.verticalMargin}variant='display1' color='inherit' align='center'>Organisasjonskart</Typography>
                            
                            <Paper className={classes.miniMargin} square elevation={1}>
                                <ClickableImage className={classes.miniPadding} image={OrgMap} alt='organisasjonskart' width='90%'/>
                            </Paper>
                        </div>
                    </div>

                    <div>
                        <div className={classes.section}>
                            <InfoCard className={classes.verticalMargin} header='Historie' text={Text.history} subheader='Opptak' subText={Text.history2} justifyText/>
                        </div>
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
