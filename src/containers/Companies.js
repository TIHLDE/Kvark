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

const styles = {
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
    section: {
        padding: 48,
        maxWidth: 1200,
        margin: 'auto',
        '@media only screen and (max-width: 1200px)': {
            padding: '48px 0',
        }
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'auto',
        justifyContent: 'center',
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
    smoke: {
        backgroundColor: '#f9f9f8',
    },
};

class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opening: false,
        };
        this.formRef = React.createRef();
        this.firstTextFieldRef = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0,0);
    }

    // Brukes til å åpne den hvis den ikke er åpen
    handleExpansionToggle = (bool) => (event) => {
        if(bool || !this.state.opening) {
            this.focusFirstTextField();
        }
        if(bool) {
            this.setState({opening: bool})
        } else {
            this.setState({opening: !this.state.opening})
        }
    };

    focusFirstTextField = () => {
        const node = ReactDOM.findDOMNode(this.firstTextFieldRef.current);
        node.focus({preventScroll: true});
    };

    scrollToForm = () => {
        this.focusFirstTextField();
        const node = ReactDOM.findDOMNode(this.formRef.current);
        window.scroll({top: node.offsetTop-60, left: 0, behavior: 'smooth'});
    };

    render() {
        const { classes } = this.props;

        return (
        <Navigation footer whitesmoke>
            <div className={classes.grid}>
                <div className={classes.section}>
                    <Banner title={Text.bannnerTitle} image={Text.bannerPicture}/>
                    <Expansion ref={this.formRef} header={Text.header} expand={this.state.opening} customCallback={this.handleExpansionToggle()}>
                        <Forum setMessage={this.setMessage} data ={{forumText1: Text.forumText2 , forumText2: Text.forumText2}} firstTextFieldRef={this.firstTextFieldRef}/>

                    </Expansion>
                </div>
                <div className={classes.smoke}>
                    <div className={classNames(classes.section)}>
                        <Typography variant='display1' color='inherit' align='center' className={classes.margining}>Vi tilbyr</Typography>
                        <div className={classNames(classes.container)}>
                            <InfoCard header='Jobbannonser' text={Text.jobbannonser} />
                            <InfoCard header='Bedriftpressentasjon' text={Text.bedrifter}/>
                        </div>
                    </div>
                </div>

                <div className={classes.section}>
                    <Typography variant='display1' color='inherit' align='center' className={classes.margining}>{Text.studier}</Typography>
                    <div className={classNames(classes.container)}>
                        <InfoCard header='Dataingeniør' text={Text.data}/>
                        <InfoCard header='Drift' text={Text.drift}/>
                        <InfoCard header='IT-støttet bedriftsutvikling' text={Text.support}/>
                        <InfoCard header='IKT-basert samhandling' text={Text.IKT}/>
                    </div>
                </div>

                <div className={classes.smoke}>
                    <div className={classes.section}>
                        <InfoCard imageClass={classes.imageClass} header={'Om TIHLDE'} text={Text.cardInfo} src={Image}/>
                    </div>
                </div>
                <div className={classes.section}>
                    <Button variant='contained' color='primary' onClick={(event) => { this.scrollToForm(); this.handleExpansionToggle(true)(event) }}>Send oss en melding</Button>
                </div>
            </div>
        </Navigation>
        );
    }

}

export default withStyles(styles)(Companies);
