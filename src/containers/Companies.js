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
import Forum from '../components/Forum'

import Text from '../text/CompaniesText';
import Expansion from '../components/Expand';
import * as ReactDOM from "react-dom";


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
            opening: true,
        };
        this.formRef = React.createRef();
    }
    // Brukes til å åpne den hvis den ikke er åpen
    handleExpansionToggle = (bool) => (event) => {
        if(bool) {
            this.setState({opening: bool})
        } else {
            this.setState({opening: !this.state.opening})
        }
    };

    scrollToForm = () => {
        const node = ReactDOM.findDOMNode(this.formRef.current);
        window.scroll({top: node.offsetTop, left: 0, behavior: 'smooth'});
    };

    render() {
        const { classes } = this.props;

        return (
        <Navigation footer whitesmoke>
            <div className={classes.root}>
                <div className={classes.grid}>
                    <div>
                    <Banner title={Text.bannnerTitle} image={Text.bannerPicture} className={classes.banner}/>
                    <Expansion ref={this.formRef} header={Text.header} expand={this.state.opening} customCallback={this.handleExpansionToggle()}>

                        <Forum data ={{forumText1: Text.forumText2 , forumText2: Text.forumText2}}/>

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

                    <Button variant='contained' color='primary' onClick={(event) => { this.scrollToForm(); this.handleExpansionToggle(true)(event) }}>Send oss en melding</Button>
                </div>
            </div>
        </Navigation>
        );
    }

}

export default withStyles(styles)(Companies);
