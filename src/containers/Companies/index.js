import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

// Icons
import Image from '../../assets/img/glad.jpg';
import Send from '@material-ui/icons/Send';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';
import Forum from './components/Forum'

import Text from '../../text/CompaniesText';
import * as ReactDOM from "react-dom";

const styles = {
    root: {
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
    section: {
        padding: 48,
        maxWidth: 1200,
        margin: 'auto',
        '@media only screen and (max-width: 1200px)': {
            padding: '48px 0',
        }
    },
    topSection: {
        padding: '20px 48px 48px 48px',

        '@media only screen and (max-width: 1200px)': {
            padding: '12px 0px 48px 0px',
        }
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
        backgroundColor: '#fafafa',
    },
    toFormBtn: {
        display: 'block',
        margin: 'auto',
    },
    formWrapper: {
        margin:'15px 0',
    },
    flex: {
        display: 'flex',
        justifyContent: 'justify-content',
        alignItems: 'center',
    }
};

class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opening: true,
        };
        this.formRef = React.createRef();
        this.firstTextFieldRef = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0,0);

        this.focusFirstTextField();
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
        window.scroll({top: node.offsetTop-84, left: 0, behavior: 'smooth'});
    };

    render() {
        const { classes } = this.props;

        return (
        <Navigation footer>
            <div className={classes.root}>
                <div className={classNames(classes.section, classes.topSection)}>
                    <Banner title={Text.bannnerTitle} image={Text.bannerPicture}/>
                    <Paper className={classes.formWrapper} ref={this.formRef} square>
                        <Forum
                            setMessage={this.setMessage}
                            data ={{forumText1: Text.forumText2 , forumText2: Text.forumText2}}
                            firstTextFieldRef={this.firstTextFieldRef}
                            scrollToForm={this.scrollToForm}/>
                    </Paper>
                </div>
                <div className={classes.smoke}>
                    <div className={classNames(classes.section)}>
                        <Typography variant='display1' color='inherit' align='center' className={classes.margining}>Vi tilbyr</Typography>
                        <div className={classNames(classes.container)}>
                            <InfoCard header='Stillingsannonser' text={Text.jobbannonser} justifyText/>
                            <InfoCard header='Bedriftpressentasjon' text={Text.bedrifter} justifyText/>
                        </div>
                    </div>
                </div>

                <div className={classes.section}>
                    <Typography variant='display1' color='inherit' align='center' className={classes.margining}>{Text.studier}</Typography>
                    <div className={classNames(classes.container)}>
                        <InfoCard header='Dataingeniør' text={Text.data} justifyText/>
                        <InfoCard header='Drift' text={Text.drift} justifyText/>
                        <InfoCard header='IT-støttet bedriftsutvikling' text={Text.support} justifyText/>
                        <InfoCard header='IKT-basert samhandling' text={Text.IKT} justifyText/>
                    </div>
                </div>

                <div className={classes.smoke}>
                    <div className={classes.section}>
                        <InfoCard imageClass={classes.imageClass} header={'Om TIHLDE'} text={Text.omTIHLDE} src={Image}/>
                    </div>
                </div>
                <div className={classes.section}>
                    <Button
                        className={classes.toFormBtn}
                        variant='contained'
                        color='primary'
                        onClick={(event) => { this.scrollToForm(); this.handleExpansionToggle(true)(event) }}>
                        <div className={classes.flex}>
                            <Send />
                            Send oss en melding
                        </div>
                    </Button>
                </div>
            </div>
        </Navigation>
        );
    }

}

export default withStyles(styles)(Companies);
