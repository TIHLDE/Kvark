import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Paper from '@material-ui/core/Paper';
// Project Components
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import cake from '@material-ui/icons/Cake';
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
        maxHeight: 800,
        height: 800,
        display: 'grid',
        gridTemplateRows: '50% 50%',
        gridGap: 100
    },
    icons:{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
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
                                    alt: "this is an alt text"
                                }}/>
                                <Icons data={{
                                           title: "Lover for TIHLDE",
                                           image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                           alt: "this is an alt text"
                                       }}/>
                                <Icons data={{
                                           title: "Undergruppeinstrukser",
                                           image: "http://hdwpro.com/wp-content/uploads/2017/01/3D-Cool-Image.jpg",
                                           alt: "this is an alt text"
                                       }}/>
                            </div>
                        </Paper>
                    </div>
                </div>
            </Navigation>
        );
    }
}

export default withStyles(styles)(Laws);
