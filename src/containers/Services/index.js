import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Text imports
import Text from '../../text/ServicesText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import DatabaseIcon from '../../assets/icons/database.png';
import EmailIcon from '../../assets/icons/email.svg';
import HostingIcon from '../../assets/icons/hosting.png';
import VirtualIcon from '../../assets/icons/virtual.png';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';

const styles = {
    root: {
        minHeight: '100vh',
        maxWidth: 1200,
        margin: 'auto',
        paddingBottom: 100,
    },
    grid: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '15px',

        marginTop: 10,
        marginBottom: 30,

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
    bottomSpacing: {
        marginBottom: 10,
    },
    minify: {
        '@media only screen and (max-width: 600px)': {
            fontSize: 40,
        },
    },
    flex: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    banner: {
        marginTop: 20,
    },
};


class Services extends Component {

    componentDidMount() {
        window.scrollTo(0, 0); // Scrolls to the top
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer whitesmoke>
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <Banner
                        className={classes.banner}
                        image='http://www.mfactors.co.za/images/services.jpg'
                        title={Text.header}
                        header='Colagrol bruker'
                        text={Text.colargol} />

                    <div className={classes.grid}>
                        <InfoCard header='E-post' text={Text.email} src={EmailIcon} classes={{children: classes.flex}} justifyText>
                            <Button className={classes.bottomSpacing} variant='contained' color='primary' href='https://webmail.tihlde.org/'>Gå til webmail</Button>
                           {/*  <Button className={classes.bottomSpacing} variant='outlined' color='secondary'>Les mer</Button> */}
                        </InfoCard>
                        <InfoCard header='Hosting' text={Text.hosting} src={HostingIcon} classes={{children: classes.flex}} justifyText>
                            <Button className={classes.bottomSpacing} variant='contained' color='primary' href='https://wiki.tihlde.org/landing/fantorangen'>Bestill domene</Button>
                           {/*  <Button className={classes.bottomSpacing} variant='outlined' color='secondary'>Les mer</Button> */}
                        </InfoCard>
                        <InfoCard header='Virtuelle Maskiner' text={Text.virtual} src={VirtualIcon} classes={{children: classes.flex}} justifyText>
                            <Button className={classes.bottomSpacing} variant='contained' color='primary' href='https://wiki.tihlde.org/landing/fantorangen'>Bestill tjenesten</Button>
                            {/* <Button className={classes.bottomSpacing} variant='outlined' color='secondary'>Les mer</Button> */}
                        </InfoCard>
                        <InfoCard header='Database' text={Text.database} src={DatabaseIcon} classes={{children: classes.flex}} justifyText>
                            <Button className={classes.bottomSpacing} variant='contained' color='primary' href='https://wiki.tihlde.org/landing/fantorangen'>Bestill mer plass</Button>
                            {/* <Button className={classes.bottomSpacing} variant='outlined' color='secondary'>Les mer</Button> */}
                        </InfoCard>
                    </div>
                </Grid>
            </Navigation>
        );
    }
}

Services.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Services);
