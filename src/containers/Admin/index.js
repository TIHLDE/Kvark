import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Link from 'react-router-dom/Link';
import URLS from '../../URLS';

// API and store import
import UserService from '../../api/services/UserService';

// Text imports
import Text from '../../text/AdminText';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Icons
import ServiceBanner from '../../assets/img/ServiceBanner.jpg';
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
    button: {
        marginBottom: 10,
        width: '100%',
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


class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isHS: false,
            isPromo: false,
            isNok: false,
            isDevkom: false,
        }
    }

    loadIsGroupMember = () => {
        UserService.isGroupMember().then((groups) => {
            groups.isHS && this.setState({isHS: true});
            groups.isPromo && this.setState({isPromo: true});
            groups.isNok && this.setState({isNok: true});
            groups.isDevkom && this.setState({isDevkom: true});
            console.log(this.state);
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0); // Scrolls to the top
        this.loadIsGroupMember();
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer whitesmoke>
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <Banner
                        className={classes.banner}
                        image={ServiceBanner}
                        title={Text.header}
                        text={Text.desc} />

                    <div className={classes.grid}>
                        { (this.state.isHS || this.state.isPromo || this.state.isNok || this.state.isDevkom) &&
                        <InfoCard header='Arrangementer' text={Text.events} src={EmailIcon} classes={{children: classes.flex}} justifyText>
                            <Link to={URLS.eventAdmin}><Button className={classes.button} variant='contained' color='primary'>Gå til arrangementer</Button></Link>
                        </InfoCard>
                        }
                        { (this.state.isHS || this.state.isDevkom) &&
                        <InfoCard header='Jobbannonser' text={Text.jobposts} src={HostingIcon} classes={{children: classes.flex}} justifyText>
                            <Link to={URLS.jobpostsAdmin}><Button className={classes.button} variant='contained' color='primary'>Gå til jobbannonser</Button></Link>
                        </InfoCard>
                        }
                        {/* <InfoCard header='Grupper' text={Text.groups} src={VirtualIcon} classes={{children: classes.flex}} justifyText>
                            <Link to={URLS.}><Button className={classes.button} variant='contained' color='primary'>Gå til grupper</Button></Link>
                        </InfoCard> */}
                    </div>
                </Grid>
            </Navigation>
        );
    }
}

Admin.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Admin);
