import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

// Icons
import GavelIcon from '@material-ui/icons/Gavel';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import Icons from './components/Icons';
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
    icons:{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        gridGap: '1px',

        '@media only screen and (max-width: 600px)': {
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
                        <Banner title='Law and Order' image={bannerImage}/>
                        <Paper className={classes.container}>
                            <div className={classes.icons}>
                                <Icons data={{
                                    title: "Styreinstruks for hovedstyret",
                                    image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                    alt: "this is an alt text",

                                }} icon={GavelIcon}/>
                                   <Icons data={{title: "Lover for TIHLDE",
                                       image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                       alt: "this is an alt text"
                                   }} icon={GavelIcon}/>
                                <Icons data={{
                                           title: "Undergruppeinstrukser",
                                           image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                           alt: "this is an alt text"
                                       }} icon={GavelIcon}/>
                            </div>
                            <Divider />
                            <div>
                                PUT THE REST HERE
                            </div>
                        </Paper>
                    </div>
                </div>
            </Navigation>
        );
    }
}

export default withStyles(styles)(Laws);
