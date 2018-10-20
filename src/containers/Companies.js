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


const styles = (theme) => ({
    container: {
        display: 'grid',
        maxWidth: '1200px',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoFlow: 'rows',
        gridGap: `${theme.spacing.unit * 3}px`,
        margin: '0 auto',

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '1fr',
        },
    },
    wrapper: {
        backgroundColor: '#FBFBFB',
        margin: '0 auto',
    },
    extraPadding: {
        padding: '100px 30px',

        '@media only screen and (max-width: 600px)': {
            padding: '40px 30px',
        },
    },
    paper: {
        color: theme.palette.text.secondary,
        margin: '0 auto',
        width: '90%',
        maxWidth: 1200,
        marginBottom: theme.spacing.unit,
    },
    divider: {
        margin: `${theme.spacing.unit * 2}px 0`,
    },
    send: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        color: 'white',
        backgroundColor: 'var(--tihlde-blaa)',
    },
    header: {
        maxWidth: 1200,
        margin: '0 auto',
        marginBottom: 30,
    },
    miniContainer: {
        display: 'grid',
        maxWidth: '1200px',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: `${theme.spacing.unit * 3}px`,
        margin: '0 auto',

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '1fr',
        },
    },
    columnContainer: {
        margin: '0 auto',
        maxWidth: 1200,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    title: {
        fontSize: '4em',

        '@media only screen and (max-width: 900px)': {
            fontSize: '7vw',
        },

        '@media only screen and (max-width: 600px)': {
            fontSize: '3em',
        },
    },
    subTitle: {
        fontSize: '1em',

        '@media only screen and (max-width: 900px)': {
            fontSize: '3vw',
        },

        '@media only screen and (max-width: 600px)': {
            fontSize: '1.3em',
        },
    },
    paddingWrapper: {
        padding: theme.spacing.unit * 3,
    },
    image: {
        maxHeight: 400,
        objectFit: 'cover',
    }
});

const ImageAndText = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <div className={classes.miniContainer}>
            <div>
                <Typography variant='title'>Om TIHLDE</Typography>
                <Typography variant='body2'>
                    TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                </Typography>
            </div>
            <div><img src={ Image } width='100%' alt='company' /></div>
        </div>
    )
});


const buttonStyle = {
    root: {
        display: 'table',
        margin: '0 auto',
        marginTop: -20,
        marginBottom: 40
    }
};
const ContactButton = withStyles(buttonStyle)((props) => {
    const { classes } = props;
    return (
        <Button
            className={classes.root}
            variant='raised'
            color='primary'
            href='mailto:orakel@tihlde.org'
        >
            Kontakt oss
        </Button>
    )
});

class Companies extends Component {

    render() {
        const { classes } = this.props;

        return <Navigation footer>
            <a href='mailto:orakel@tihlde.org'><Button variant='fab' className={classes.send}><SendIcon /></Button></a>

            <div className={classNames(classes.extraPadding)}>
                <div className={classes.columnContainer}>
                    <Typography className={classes.title} variant='title'><strong>Vil du komme i kontakt med våre studenter?</strong></Typography>
                    <Typography className={classes.subTitle} variant='body2'>
                        Hvert år finner TIHLDE-studenter jobber i attraktive bedrifter landet over. For å få studentene inn i nettopp din bedrift tilbyr vi bedriftspresentasjoner og posting av stillingsannonser på våre sider.
                    </Typography>
                </div>
            </div>
            <ContactButton />
            <div className={classes.wrapper}>
                <div className={classNames(classes.columnContainer, classes.extraPadding)}>
                    <div>
                        <Paper className={classes.paper}>
                            <div className={classes.paddingWrapper}>
                                <Typography variant='title'>Høres dette intressant ut? Send <a href='mailto:orakel@tihlde.org'>oss</a> en mail </Typography>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
            <div className={classNames(classes.extraPadding)}>
                <ImageAndText/>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.extraPadding}>
                    <div className={classes.header}>
                        <Typography variant='headline'>Studier</Typography>
                    </div>
                    <div className={classNames(classes.container)}>
                        <InfoCard header='Dataingeniør' text=' TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.'/>
                        <InfoCard header='Drift av datasystemer' text='TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.'/>
                        <InfoCard header='IT-støttet bedriftsutvikling' text=' TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.'/>
                        <InfoCard header='IKT-basert samhandling' text='TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.'/>
                    </div>
                </div>
            </div>
            <div style={{ gridColumnEnd: 'span 2', gridRow: 1, overflow: 'hidden'}}>
                <img className={classes.image} src='https://www.ntnu.no/image/image_gallery?img_id=16401786&t=1346178827979' width='100%' alt='NTNU'/>
            </div>
            <div className={classNames(classes.columnContainer, classes.extraPadding)}>
                <div>
                    <Typography variant='headline' gutterBottom>Vi tilbyr</Typography>
                </div>
                <div className={classes.miniContainer}>
                    <div>
                        <Typography variant='title'>Bedriftspresentasjoner</Typography>
                        <Typography variant='body2'>
                            TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                        </Typography>
                    </div>
                    <div>
                        <Typography variant='title'>Jobbannonser</Typography>
                        <Typography variant='body2'>
                            TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                        </Typography>
                    </div>
                </div>
            </div>

             <div className={classes.wrapper}>
                <div className={classNames(classes.columnContainer, classes.extraPadding)}>
                    <div>
                        <Paper className={classes.paper}>
                            <div className={classes.paddingWrapper}>
                                <Typography variant='title'>Høres dette intressant ut? Send <a href='mailto:orakel@tihlde.org'>oss</a> en mail </Typography>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>

        </Navigation>;
    }

}

export default withStyles(styles)(Companies);
