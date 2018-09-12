import React, {Component} from 'react';

import Navigation from '../components/Navigation';

import Typography from '@material-ui/core/Typography';


class About extends Component {

    render() {

        return <Navigation footer>
            <div style={{'margin': '500px'}}>
                <Typography variant='headline'>Om Tihlde</Typography>
                <Typography variant='body1'>TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Drift av datasystemer og IT-støttet bedriftsutvikling, samt masterstudiet Digital samhandling ved AIT, IDI, NTNU på Kalvskinnet.</Typography>
                <Typography variant='body1'>Historie</Typography>
                <Typography variant='body1'>TIHLDE ble stiftet 16.april 1993, med formål å fremme det sosiale og faglige tilbudet ved EDB-avdelingen ved TIH, som etterhvert ble AITeL ved HiST, deretter IIE ved HiST, nå AIT, IDI ved NTNU. Mye har skjedd siden da, men dette er fortsatt vårt mål. Alle studenter og ansatte tilknyttet AIT, IDI ved Kalvskinnet kan bli medlem, men opptaket skjer kun i begynnelsen av hvert skoleår.</Typography>
                <Typography variant='body1'>TIHLDE er en ikke-profitabel og politisk nøytral organisasjon som baserer seg på frivillig engasjement fra studenter. I tillegg til hovedstyret (HS), har vi pr idag 4 undergrupper: drift, orakel, sosialen og promo, og 8 komitéer: ÅreKom, FestKom, ArrKom, KosKom, TurKom, JubKom, NetKom, og FadderKom.</Typography>
                <Typography variant='body1'>Organisasjonskart</Typography>
                <Typography variant='body1'>Undergrupper</Typography>
                <Typography variant='body1'>Drift er en gruppe på 9 studenter som tar seg av drifting av TIHLDEs datasystemer. Her inngår bla. medlemstjeneren Colargol, studenttjeneren Balthazar, VM-parken Nerdvana samt andre støttetjenere. Oppgavene til Drift er brukeradministrasjon, backup, installasjon og oppgradering av programvare, DNS-administrering, brannslukking og annet. Medlemmene i drift opparbeider seg en betydelig kompetanse på UNIX, og Linux spesielt.</Typography>
                <Typography variant='body1'>Næringsliv og Kurs, tidligere Orakel, jobber for å fremme det faglige tilbudet til medlemmene. Her inngår bla. bedriftspresentasjoner, kurs, foredrag, nærlingslivsdag og lignende.</Typography>
                <Typography variant='body1'>Sosialen jobber for å fremme sosiale aktiviteter blant medlemmene. Det være seg sosiale tilstelninger som fester, kino, bowling, gokart mm. Fantasien er grensen, og forslag til aktiviteter mottas med smil! :)</Typography>
                <Typography variant='body1'>Promo har som oppgave å informere studenter og medlemmer om TIHLDEs saker og arrangementer, i tillegg til å dokumentere hendinger som har vært.</Typography>
            </div>
        </Navigation>

    }

}

export default About;