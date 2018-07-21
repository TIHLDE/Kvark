import React, { Component } from 'react';

import Navigation from '../components/Navigation';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';

import SendIcon from '@material-ui/icons/Send';

import Image from '../assets/img/glad.jpg';


const styles = theme => ({
    container: {
        display: 'grid',
        maxWidth: '1200px',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: `${theme.spacing.unit * 3}px`,
        margin: '0 auto',
        padding: '100px 30px',
    },
    wrapper: {
        backgroundColor: '#FBFBFB'
    },
    paper: {
        padding: theme.spacing.unit,
        color: theme.palette.text.secondary,
        minWidth: '250px !important',
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
        backgroundColor: 'var(--tihlde-blaa)'
    }
});

class Companies extends Component {

    render() {
        const { classes } = this.props;

        return <Navigation>
                <a href='mailto:orakel@tihlde.org'><Button variant='fab' className={classes.send}><SendIcon /></Button></a>

            <div className={classes.container}>
                <div style={{ gridColumnEnd: 'span 12', gridRow: 1 }}>
                    <Typography variant='title'>Vil du komme i kontakt med våre studenter?</Typography>
                    <Typography variant='body2'>
                        Hvert år finner TIHLDE-studenter jobber i attraktive bedrifter landet over. For å få studentene inn i nettopp din bedrift tilbyr vi bedriftspresentasjoner og posting av stillingsannonser på våre sider.
                    </Typography>
                </div>
                <div style={{ gridColumnEnd: 'span 12', padding: '100px 0' }}>
                    <Typography variant='title'>Høres dette intressant ut? Send <a href='mailto:orakel@tihlde.org'>oss</a> en mail da :) </Typography>
                </div>
            </div>

                <div className={classes.container}>
                    <div style={{ gridColumnEnd: 'span 6', gridRow: 1 }}>
                            <Typography variant='title'>Om TIHLDE</Typography>
                            <Typography variant='body2'>
                                TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                            </Typography>
                    </div>
                  <div style={{ gridColumnEnd: 'span 6', gridRow: 1 }}><img src={ Image } width='100%' /></div>
                </div>

            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div style={{ gridColumnEnd: 'span 12', gridRow: 1 }}>
                            <Typography variant='headline'>Studier</Typography>
                        </div>
                    <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                        <Paper className={classes.paper}>
                            <Typography variant='title'>Dataingeniør</Typography>
                            <Typography variant='body2'>
                                TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                                </Typography>
                        </Paper>
                    </div>
                    <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                        <Paper className={classes.paper}>
                            <Typography variant='title'>Drift av datasystemer</Typography>
                            <Typography variant='body2'>
                                TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                                </Typography>
                        </Paper>
                    </div>
                    <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                        <Paper className={classes.paper}>
                            <Typography variant='title'>IT-støttet bedriftsutvikling</Typography>
                            <Typography variant='body2'>
                                TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                                </Typography>
                        </Paper>
                    </div>
                    <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                        <Paper className={classes.paper}>
                            <Typography variant='title'>IKT-basert samhandling</Typography>
                            <Typography variant='body2'>
                                TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                                </Typography>
                        </Paper>
                    </div>
            </div></div>
            <div style={{ gridColumnEnd: 'span 6', gridRow: 1, height: 500, overflow: 'hidden'}}>
                <img src='https://www.ntnu.no/image/image_gallery?img_id=16401786&t=1346178827979' width='100%'  />
            </div>
            <div className={classes.container}>
                <div style={{ gridColumnEnd: 'span 12', gridRow: 1 }}>
                    <Typography variant='headline'>Vi tilbyr</Typography>
                </div>
                <div style={{ gridColumnEnd: 'span 6', gridRow: 2 }}>
                    <Typography variant='title'>Bedriftspresentasjoner</Typography>
                    <Typography variant='body2'>
                        TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                    </Typography>
                </div>
                <div style={{ gridColumnEnd: 'span 6', gridRow: 2 }}>
                    <Typography variant='title'>Jobbannonser</Typography>
                    <Typography variant='body2'>
                        TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet IKT-basert samhandling ved AIT, IDI, NTNU på Kalvskinnet.
                    </Typography>
                </div>
                <div style={{ gridColumnEnd: 'span 12', padding: '100px 0' }}>
                        <Typography variant='title'>Høres dette intressant ut? Send <a href='mailto:orakel@tihlde.org'>oss</a> en mail da :) </Typography>
                </div>
            </div>

        </Navigation>
    }

}

export default withStyles(styles)(Companies);