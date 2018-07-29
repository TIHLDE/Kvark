import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Project Components
import Navigation from '../components/Navigation';


const styles = (theme) => ({
    container: {
        display: 'grid',
        maxWidth: '1200px',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: `${theme.spacing.unit * 3}px`,
        margin: '100px auto',
    },
    paper: {
        padding: theme.spacing.unit,
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing.unit,
    },
    divider: {
        margin: `${theme.spacing.unit * 2}px 0`,
    },
});

class Groups extends Component {

    render() {
        const { classes } = this.props;

        return (
            <Navigation>
            <div className={classes.container}>
               
                <div style={{ gridColumnEnd: 'span 12', gridRow: 1 }}>
                    <Typography variant='headline'>Undergrupper</Typography>
                </div>
                <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                    <Paper className={classes.paper}>
                        <Typography variant='title'>Drift</Typography>
                        <Typography variant='body2'>
                            Drift er en gruppe på 9 studenter som tar seg av drifting av TIHLDEs datasystemer. Her inngår bla. medlemstjeneren Colargol, studenttjeneren Balthazar, VM-parken Nerdvana samt andre støttetjenere. Oppgavene til Drift er brukeradministrasjon, backup, installasjon og oppgradering av programvare, DNS-administrering, brannslukking og annet. Medlemmene i drift opparbeider seg en betydelig kompetanse på UNIX, og Linux spesielt.
                        </Typography>
                    </Paper>
                </div>
                <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'> Næringsliv og Kurs</Typography>
                        <Typography variant='body2'>
                            Næringsliv og Kurs, tidligere Orakel, jobber for å fremme det faglige tilbudet til medlemmene. Her inngår bla. bedriftspresentasjoner, kurs, foredrag, nærlingslivsdag og lignende.
                        </Typography>
                    </Paper>
                </div>
                <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>Sosialen</Typography>
                        <Typography variant='body2'>
                            Sosialen jobber for å fremme sosiale aktiviteter blant medlemmene. Det være seg sosiale tilstelninger som fester, kino, bowling, gokart mm. Fantasien er grensen, og forslag til aktiviteter mottas med smil! :)
                        </Typography>
                    </Paper>
                </div>
                <div style={{ gridColumnEnd: 'span 3', gridRow: 2 }}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>Promo </Typography>
                        <Typography variant='body2'>
                            Promo har som oppgave å informere studenter og medlemmer om TIHLDEs saker og arrangementer, i tillegg til å dokumentere hendinger som har vært.
                        </Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 12' }}>
                        <Typography variant='headline'>Komitéer</Typography>
                </div>

                <div style={{ gridColumnEnd: 'span 3'}}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>ÅreKom</Typography>
                        <Typography variant='body2'>
                            ÅreKomitéen arrangerer hvert år ÅREts villeste hyttetur hvert år, for over 100 datastudenter som drar til fjellbyen Åre for å stå på ski, afterski, og markere semesterstart.
                    </Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 3'}}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>FestKom</Typography>
                        <Typography variant='body2'>
                            FestKom er en en komité som arrangerer alle fester underveis i semesteret. Dette inkluderer de tradisjonsrike Halloween- og eksamensfestene til TIHLDE.
                    </Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 3'}}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>ArrKom</Typography>
                        <Typography variant='body2'>
                            Arrangementskomitéen til TIHLDE har ansvar for alle store sosiale arrangementer utenom rene fester. Dette er naturlig nok stor variasjon i typen arrangementer, og jobben er derfor svært variert
    
    
                    </Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 3'}}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>KosKom </Typography>
                        <Typography variant='body2'>
                            Kosekomitéen er den koseligste komitéen i TIHLDE.
    KosKom sitt oppdrag er å spre kos, glede og god stemning gjennom linjeforeningen, dets medlemmer og dets frivillige.
                    </Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 3'}}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>TurKom</Typography>
                        <Typography variant='body2'>
                           TutKom er en helt ny komité som ble startet av engasjerte og turglade studenter, etter ønske fra Generalforsamlingen.
     TurKom skal gi turglede hos TIHLDEs medlemmer, og skal gjøre dette ved å arrangere telt- og overnattingsturer 2 – 3 ganger i semesteret.</Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 3'}}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>JubKom</Typography>
                        <Typography variant='body2'>
                            Jubileumskomitéen til TIHLDE aktiveres hvert jubileums år, vanligvis hvert 5 år.
        JubKom sitt virke går ut på å markere linjeforeningen, og dens historie for TIHLDE medlemmer.
                </Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 3'}}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>NetKom</Typography>
                        <Typography variant='body2'>
                            Nettsidekomitéen ble utviklet med formål om å utforme en ny nettside til TIHLDE.
        I dag jobber 6 engasjerte og flinke studenter med nettopp dette.
                </Typography>
                    </Paper>
                </div>

                <div style={{ gridColumnEnd: 'span 3', gridRow: 4 }}>
                    <Paper className={classes.paper}>
                            <Typography variant='title'>FadderKom </Typography>
                        <Typography variant='body2'>
                            FadderKomitéen arrangerer hvert år fadderuka for nye studenter. Det er over 80 frivillige og faddere som er engasjert for å gi nye studenter best mulig start på studiet.
                </Typography>
                    </Paper>
                </div>


            </div>

            </Navigation>
        );
    }
};

Groups.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Groups);
