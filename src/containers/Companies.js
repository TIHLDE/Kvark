import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Icons
import SendIcon from '@material-ui/icons/Send';
import Image from '../assets/img/glad.jpg';

// Project Components
import Navigation from '../components/Navigation';
import InfoCard from '../components/InfoCard';
import Banner from '../components/Banner';

import Text from '../text/CompaniesText';


const styles = (theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'auto',
        margin: '0 auto',
        gridGap: '20px',
        justifyContent: 'center',
        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '1fr',
        },
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '80%',
        gridTemplateRows: 'auto',
        justifyContent: 'center',
        backgroundColor: 'whitesmoke',
        paddingBottom: '50px',
        gridGap: '40px',
    },
    banner: {
        marginTop: '20px',
    },
    imageClass: {
        width: 400,
        maxWidth: 'none',
        maxHeight: 'none',
        height: 'auto',
        '@media only screen and (max-width: 800px)': {
            width: '100%',
        },
    },
    margining: {
        marginBottom: '20px',
    },
});


class Companies extends Component {

    render() {
        const { classes } = this.props;

        return (
        <Navigation footer>
            <div className={classes.grid}>
                <Banner title={Text.bannnerTitle} image={Text.bannerPicture} className={classes.banner}/>
                <InfoCard imageClass={classes.imageClass} header={'Om TIHLDE'} text={Text.cardInfo} src={Image}/>

                <div>
                <Typography variant='display1' color='inherit' className={classes.margining}>{Text.studier}</Typography>
                <div className={classNames(classes.container)}>
                    <InfoCard header='Dataingeniør' text={Text.data}/>
                    <InfoCard header='Drift' text={Text.drift}/>
                    <InfoCard header='IT-støttet bedriftsutvikling' text={Text.support}/>
                    <InfoCard header='IKT-basert samhandling' text={Text.IKT}/>
                </div>
                </div>

                <div>
                <Typography variant='display1' color='inherit' className={classes.margining}>Vi tilbyr</Typography>
                    <div className={classNames(classes.container)}>
                        <InfoCard header='Jobbannonser' text={Text.jobbannonser} />
                        <InfoCard header='Bedriftpressentasjon' text={Text.bedrifter}/>
                    </div>
                </div>
            </div>
        </Navigation>
        );
    }

}

export default withStyles(styles)(Companies);
