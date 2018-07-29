import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';

// Project Components
import Navigation from '../components/Navigation';
import GroupCard from '../components/InfoCard';


const styles = (theme) => ({
    root: {
        width: '100%',
        maxWidth: 1400,
        margin: 'auto',
        marginTop: 100,
    },
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridGap: `${theme.spacing.unit * 3}px`,

        padding: '0 5px',
        marginBottom: 40,

        '@media only screen and (max-width: 900px)': {
            gridTemplateColumns: '1fr 1fr',
        },

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '100%',
        },
    },
    header: {
        paddingLeft: 5,
        marginBottom: 10,
    },
    divider: {
        margin: `${theme.spacing.unit * 2}px 0`,
    },
});



class Groups extends Component {

    render() {
        const { classes } = this.props;

        return (
            <Navigation footer>
                <div className={classes.root}>
                    <div className={classes.header}>
                        <Typography variant='headline'>Undergrupper</Typography>
                    </div>
                    <div className={classes.container}>
                        <GroupCard header='Drift' body=' Drift er en gruppe på 9 studenter som tar seg av drifting av TIHLDEs datasystemer. Her inngår bla. medlemstjeneren Colargol, studenttjeneren Balthazar, VM-parken Nerdvana samt andre støttetjenere. Oppgavene til Drift er brukeradministrasjon, backup, installasjon og oppgradering av programvare, DNS-administrering, brannslukking og annet. Medlemmene i drift opparbeider seg en betydelig kompetanse på UNIX, og Linux spesielt.'/>
                        <GroupCard header='Næringsliv og Kurs' body='Næringsliv og Kurs, tidligere Orakel, jobber for å fremme det faglige tilbudet til medlemmene. Her inngår bla. bedriftspresentasjoner, kurs, foredrag, nærlingslivsdag og lignende.'/>
                        <GroupCard header='Sosialen' body=' Sosialen jobber for å fremme sosiale aktiviteter blant medlemmene. Det være seg sosiale tilstelninger som fester, kino, bowling, gokart mm. Fantasien er grensen, og forslag til aktiviteter mottas med smil! :)'/>
                        <GroupCard header='Promo' body='Promo har som oppgave å informere studenter og medlemmer om TIHLDEs saker og arrangementer, i tillegg til å dokumentere hendinger som har vært.'/>
                    </div>
                    <div className={classes.header}>
                        <Typography variant='headline'>Komitéer</Typography>
                    </div>
                    <div className={classes.container}>
                        <GroupCard header='Årekom' body='ÅreKomitéen arrangerer hvert år ÅREts villeste hyttetur hvert år, for over 100 datastudenter som drar til fjellbyen Åre for å stå på ski, afterski, og markere semesterstart.'/>
                        <GroupCard header='FestKom' body='FestKom er en en komité som arrangerer alle fester underveis i semesteret. Dette inkluderer de tradisjonsrike Halloween- og eksamensfestene til TIHLDE.'/>
                        <GroupCard header='ArrKom' body='Arrangementskomitéen til TIHLDE har ansvar for alle store sosiale arrangementer utenom rene fester. Dette er naturlig nok stor variasjon i typen arrangementer, og jobben er derfor svært variert'/>
                        <GroupCard header='KosKom' body='Kosekomitéen er den koseligste komitéen i TIHLDE.
                            KosKom sitt oppdrag er å spre kos, glede og god stemning gjennom linjeforeningen, dets medlemmer og dets frivillige.'/>
                        <GroupCard header='TurKom' body='TutKom er en helt ny komité som ble startet av engasjerte og turglade studenter, etter ønske fra Generalforsamlingen.
                            TurKom skal gi turglede hos TIHLDEs medlemmer, og skal gjøre dette ved å arrangere telt- og overnattingsturer 2 – 3 ganger i semesteret.'/>
                        <GroupCard header='JubKom' body='Jubileumskomitéen til TIHLDE aktiveres hvert jubileums år, vanligvis hvert 5 år.
                            JubKom sitt virke går ut på å markere linjeforeningen, og dens historie for TIHLDE medlemmer.'/>
                        <GroupCard header='NetKom' body='Nettsidekomitéen ble utviklet med formål om å utforme en ny nettside til TIHLDE.
                            I dag jobber 6 engasjerte og flinke studenter med nettopp dette.'/>
                        <GroupCard header='FadderKom' body=' FadderKomitéen arrangerer hvert år fadderuka for nye studenter. Det er over 80 frivillige og faddere som er engasjert for å gi nye studenter best mulig start på studiet.'/>
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
