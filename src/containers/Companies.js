import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Icons
import Image from '../assets/img/glad.jpg';

// Project Components
import Navigation from '../components/Navigation';
import InfoCard from '../components/InfoCard';
import Banner from '../components/Banner';

import Text from '../text/CompaniesText';
import Expansion from '../components/Expand';


const styles = (theme) => ({
    root: {
        maxWidth: 1200,
        margin: 'auto',
    },
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
        gridTemplateColumns: '100%',
        gridTemplateRows: 'auto',
        justifyContent: 'center',
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
    constructor(props) {
        super(props);
        this.state = {
            opening: false,
        };
        this.open = this.open.bind(this);
    }
    // Brukes til å åpne den hvis den ikke er åpen
    open = () =>{
        window.scroll({top: 0, left: 0 , behavior: 'smooth'});
        if(!this.state.opening){
            this.setState((state) => {
                return {
                    opening: !state.opening,
                };
            });
        }
    };
    // åpne og lukke
    clicked2 =() => {
        this.setState((state) => {
            return {
                opening: !state.opening,
            };
        });
    };

    render() {
        const { classes } = this.props;

        return (
        <Navigation footer whitesmoke>
            <div className={classes.root}>
                <div className={classes.grid}>
                    <div>
                    <Banner title={Text.bannnerTitle} image={Text.bannerPicture} className={classes.banner}/>
                    <Expansion header={Text.header} expand={this.state.opening} onClick={this.clicked2}>
                    </Expansion>
                    </div>
                    <InfoCard imageClass={classes.imageClass} header={'Om TIHLDE'} text={Text.cardInfo} src={Image}/>

                    <div>
                    <Typography variant='display1' color='inherit' align='center' className={classes.margining}>{Text.studier}</Typography>
                    <div className={classNames(classes.container)}>
                        <InfoCard header='Dataingeniør' text={Text.data}/>
                        <InfoCard header='Drift' text={Text.drift}/>
                        <InfoCard header='IT-støttet bedriftsutvikling' text={Text.support}/>
                        <InfoCard header='IKT-basert samhandling' text={Text.IKT}/>
                    </div>
                    </div>

                    <div>
                    <Typography variant='display1' color='inherit' align='center' className={classes.margining}>Vi tilbyr</Typography>
                        <div className={classNames(classes.container)}>
                            <InfoCard header='Jobbannonser' text={Text.jobbannonser} />
                            <InfoCard header='Bedriftpressentasjon' text={Text.bedrifter}/>
                        </div>
                    </div>

                    <Button variant='contained' color='primary' onClick={this.open}>Send oss en melding</Button>
                </div>
            </div>
        </Navigation>
        );
    }

}

export default withStyles(styles)(Companies);
