import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Grid from '@material-ui/core/Grid';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = {
  root: {
    minHeight: '100vh',
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: '15px',
    marginBottom: 40,

    '@media only screen and (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  section: {
    padding: '15px 0px 0px',
    maxWidth: 1200,
    margin: 'auto',
    width: '100%',
    '@media only screen and (max-width: 1200px)': {
      padding: '5px 0',
    },
  },
  w100: {
    width: '100%',
  },
  paper: {
    padding: 20,
    color: 'black',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff',

  },
  list: {
    paddingLeft: 30,
  },
};

class EventRules extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {classes} = this.props;
    return (
      <Navigation footer whitesmoke>
        <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
          <div className={classes.w100}>
            <div className={classes.section}>
              <div className={classes.grid}>
                <div className={classes.paper}>
                  <h1>Arrangementsregler</h1>
                  <p>Skulle det være spørsmål etter at dette er lest, ta gjerne kontakt med TIHLDE HS på orakel@tihlde.org Dersom man mener man har fått en urettferdig prikk eller at det har skjedd en feil, ta kontakt med komiteen som var ansvarlig for det gjeldende arrangementet.</p>
                  <p><i>Det kan gis tilleggsregler til spesifikke arrangement, og da vil dette opplyses om i arrangementsteksten.</i></p>
                  <h3>Spørreundersøkelse</h3>
                  <p>Påfølgende dag etter arrangementene våre sendes det ut en spørreundersøkelse. Det er ikke mulig å melde seg på TIHLDE sine arrangementer før du har svart på spørreundersøkelsen.</p>
                  <h3>Hva gir prikker</h3>
                  <ul className={classes.list}>
                    <li>Å melde seg av et arrangement etter avmeldingsfristen gir én prikk</li>
                    <li>Om man ikke møter opp på et arrangement hvor man er påmeldt gir det to prikker</li>
                    <li>Dersom man er påmeldt og møter opp etter arrangementets starttidspunkt, får man én prikk*</li>
                    <li>Dersom deltakeren oppfører seg upassende og ikke retter seg etter advarsler fra arrangementsansvarlig kan arrangerende komité gi opp til tre prikker</li>
                    <li><i><b>Flyttes du opp fra venteliste gjelder samme regler som ellers, du må derfor melde deg av ventelisten dersom du ikke har mulighet til å møte opp.</b></i></li>
                    <li><i>Ved enkelte tilfeller utviser vi skjønn. Hvis du mener at du har fått en feilaktig prikk må du sende mail til den arrangerende undergruppen.</i></li>
                  </ul>
                  <p>*<i>Gjelder kun på arrangementer i regi av Næringsliv og Kurs</i></p>
                  <h3>Konsekvenser av prikker</h3>
                  <ul className={classes.list}>
                    <li>Én prikk innebærer at du må vente 3 timer etter ordinær påmeldingsstart for å melde deg på et arrangement.</li>
                    <li>To prikker innebærer at du må vente 12 timer etter ordinær påmeldingsstart for å melde deg på et arrangement.</li>
                    <li>Tre prikker fører til sisteprioritet på alle arrangementer.</li>
                    <li>Fire eller flere prikker vil føre til at du ikke får meldt deg på arrangementer.</li>
                    <li>Hver prikk er aktiv i 20 dager fra prikken er utdelt.*</li>
                  </ul>
                  <p>*<i>Prikkene fryses i julen og om sommeren. Dette gjelder hele perioden fra siste arrangement med påmelding før ferien til offisiell skolestart.</i></p>
                  <h3>Eksempel</h3>
                  <p>Hvis du får en prikk dag 1 og to prikker 10 dager senere, vil du ha en aktiv prikk i 10 dager, tre aktive prikker i 10 dager og så to aktive prikker i 10 dager.</p>
                  <h3>Ventelisteregler</h3>
                  <p>Deltakere som står på venteliste er forventet at kan møte opp dersom det blir en ledig plass. Dette gjelder helt frem til 2 timer før arrangementets starttid. Det er deltakerens ansvar å melde seg av ventelisten, hvis det ikke passer allikevel.</p>
                  <p>Du får ikke prikk av å melde deg av ventelisten, dersom du melder deg av inntil 2 timer før arrangementsstart.</p>
                  <h3>Retningslinjer for oppførsel</h3>
                  <p>Når bedrifter velger å holde arrangementer med TIHLDE, så gjør de det for å komme i kontakt med våre studenter. Under arrangementet ønsker bedriftene å vise at de er en aktuell arbeidsplass, og på samme måte må vi vise at vi er en aktuell målgruppe for rekruttering. <b>Gode holdninger og interesserte studenter</b> gir bedriften et bedre inntrykk av besøket. Følgelig vil bedriftene være mer interesserte i å komme tilbake til TIHLDE for å profilere seg overfor oss.</p>
                  <ul className={classes.list}>
                    <li>Hvis det er bespisning under arrangement bør en oppføre seg som om man selv dro ut for å spise. Dette innebærer å vise <b>god folkeskikk</b>, og å oppføre seg som “folk flest”.</li>
                    <li>Hvis noen oppfører seg upassende på et arrangement vil vi, i den grad det er mulig, henvende oss til vedkommende og konfrontere dem med det vi mener er dårlig oppførsel, enten under eller i etterkant av arrangementet.</li>
                  </ul>
                  <p>Oppførsel som oppleves av arrangør som uakseptabel vil kunne få konsekvenser. Arrangør har rett til å vurdere og utøve sanksjoner dersom det vurderes som nødvendig eller hensiktsmessig. Om ikke man retter seg etter saklige pålegg fra representant på gjeldende arrangement vil også konsekvenser bli vurdert.</p>
                </div>
              </div>
            </div>
          </div>

        </Grid>
      </Navigation>
    );
  }

}

EventRules.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(EventRules);
