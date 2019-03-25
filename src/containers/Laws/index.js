import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

// Icons
import GavelIcon from '@material-ui/icons/Gavel';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import ListAltIcon from '@material-ui/icons/ListAlt'

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import Icons from './components/Icons';
import LinkButton from '../../components/navigation/LinkButton'

// Images
const bannerImage = 'http://www.f-covers.com/cover/law-and-order-special-victims-unit-2-facebook-cover-timeline-banner-for-fb.jpg';


const styles = {
    root: {
        maxWidth: 1200,
        margin: 'auto',
        padding: 12,
        paddingTop: 20,
    },
    wrapper:{
        paddingTop:'10px',
        paddingBottom:'30px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows:'auto',
        margin:'auto',
        gridGap:'15px',
        justifyContent:'center',
        '@media only screen and (max-width: 1200px)': {
            paddingLeft: 6,
            paddingRight: 6,
        },
    },
    container:{

    },
    content:{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        gridGap: '1px',
        '@media only screen and (max-width: 860px)': {
            gridTemplateColumns: '1fr',
        }
    },
    icons:{
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

class Laws extends Component {

    render() {
        const {classes} = this.props;
        return (
            <Navigation>
                <div className={classes.root}>
                    <div className={classes.wrapper}>
                        <Banner h6='Lover og regler' image={bannerImage}/>
                        <Paper className={classes.container}>
                            <div className={classes.icons}>
                                <Icons data={{
                                    h6: "Lover for TIHLDE",
                                    image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                    alt: "this is an alt text"
                                }} icon={GavelIcon} to={'https://tihlde.org/assets/2019/03/TIHLDEs_Lover.pdf'}/>
                                <Icons data={{
                                    h6: "Styreinstruks for hovedstyret",
                                    image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                    alt: "this is an alt text",

                                }} icon={AccountBalanceIcon} to={'https://tihlde.org/assets/2019/02/Vedlegg-02.pdf'}/>
                                <Icons data={{
                                     h6: "Undergruppeinstrukser",
                                     image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                     alt: "this is an alt text"
                                }} icon={AccountBalanceIcon} to={'https://tihlde.org/assets/2019/02/Vedlegg-03.pdf'}/>
                            </div>
                            <Divider />
                            <div className={classes.content}>
                                <LinkButton noPadding textLeft icon={ListAltIcon} to='https://tihlde.org/assets/2019/02/Vedlegg-04.pdf'>Regler for instrukser for Sosialen</LinkButton>
                                <LinkButton noPadding textLeft icon={ListAltIcon} to='https://tihlde.org/assets/2019/02/Vedlegg-05.pdf'>Regler og instrukser for Næringsliv og kurs</LinkButton>
                                <LinkButton noPadding textLeft icon={ListAltIcon} to='https://tihlde.org/assets/2019/02/Vedlegg-06.pdf'>Regler og instrukser for Drift</LinkButton>
                                <LinkButton noPadding textLeft icon={ListAltIcon} to='https://tihlde.org/assets/2019/02/Vedlegg-07.pdf'>Regler og instrukser for Promo</LinkButton>
                                <LinkButton noPadding textLeft icon={ListAltIcon} to='https://tihlde.org/assets/2019/02/Vedlegg-08.pdf'>Regler og instrukser for De Eldstes Raad</LinkButton>
                                <LinkButton noPadding textLeft icon={ListAltIcon} to='https://tihlde.org/assets/2019/02/Vedlegg-09.pdf'>Regler og instrukser for TIHLDE-kontoret</LinkButton>
                            </div>
                        </Paper>
                    </div>
                </div>
            </Navigation>
        );
    }
}

export default withStyles(styles)(Laws);
