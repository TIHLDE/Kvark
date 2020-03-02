import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import URLS from '../../URLS';

// Text Imports
import Text from '../../text/AboutText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import SocialIcon from '../../assets/icons/social.svg';
import BusinessIcon from '../../assets/icons/business.svg';
import OperationIcon from '../../assets/icons/operations.png';
import PromoIcon from '../../assets/icons/promo.svg';
import OrgMap from '../../assets/img/orgMap.svg';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import ClickableImage from '../../components/miscellaneous/ClickableImage';
import Banner from '../../components/layout/Banner';
import LinkButton from '../../components/navigation/LinkButton';

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
    topGrid: {
        gridTemplateColumns: '1fr',
    },
    padding: {
        padding: 30,

        '@media only screen and (max-width: 700px)': {
            padding: 15,
        },
    },
    section: {
        padding: '48px 0px',
        maxWidth: 1200,
        margin: 'auto',
        '@media only screen and (max-width: 1200px)': {
            padding: '48px 0',
        },
    },
    topSection: {
        padding: '20px 0 48px 0',

        '@media only screen and (max-width: 1200px)': {
            padding: '12px 0px 48px 0px',
        },
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
    orgMap: {
        margin: 4,
        border: '1px solid #ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
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
      gridGap: '1px',
      backgroundColor: '#ddd',
      paddingTop: '1px',
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
                            title={Text.header}>
                            <Grid item className={classNames(classes.linkContainer, classes.grid)}>
                                <LinkButton to='/lover/'>
                                    <Typography>TIHLDE's Lover</Typography>
                                </LinkButton>
                                <LinkButton to={URLS.services}>
                                    <Typography>Tjenester</Typography>
                                </LinkButton>
                            </Grid>
                        </Banner>
                    </div>

                    <div className={classes.smoke}>
                        <div className={classes.section}>
                            <Typography className={classes.verticalMargin} variant='h4' color='inherit' align='center'>Undergrupper</Typography>
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
                            <Typography className={classes.verticalMargin}variant='h4' color='inherit' align='center'>Komitéer</Typography>
                            <div className={classes.grid}>
                                <InfoCard header='Koskom' text={Text.kosekom} subheader='Opptak' subText={Text.kosekom2} justifyText/>
                                <InfoCard header='Devkom' text={Text.devkom} subheader='Opptak' subText={Text.devkom2} justifyText/>
                                <InfoCard header='Turkom' text={Text.turkom} subheader='Opptak' subText={Text.turkom2} justifyText/>
                                <InfoCard header='Jubkom' text={Text.jubkom} subheader='Opptak' subText={Text.jubkom2} justifyText/>
                          </div>
                        </div>
                    </div>


                    <div className={classes.smoke}>
                        <div className={classes.section}>
                            <Typography className={classes.verticalMargin}variant='h4' color='inherit' align='center'>Organisasjonskart</Typography>
                            <div className={classes.orgMap}>
                                <ClickableImage className={classes.miniPadding} image={OrgMap} alt='organisasjonskart' width='100%'/>
                            </div>
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
