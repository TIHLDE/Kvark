import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Material UI Components
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    minHeight: '100vh',
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: 15,
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
    color: theme.colors.text.main,
  },
  list: {
    paddingLeft: 30,
  },
});

function PrivacyPolicy(props) {
  const {classes} = props;

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Navigation footer whitesmoke>
      <Helmet>
        <title>Personvern - TIHLDE</title>
      </Helmet>
      <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
        <div className={classes.w100}>
          <div className={classes.section}>
            <div className={classes.grid}>
              <Paper className={classes.paper}>
                <h1>TIHLDEs personvernregler</h1>
                <p>Denne siden brukes til å informere besøkende på nettstedet om retningslinjene våre for innsamling og bruk av personlig informasjon hvis noen bestemte seg for å bruke tjenesten vår, nettstedet TIHLDE.org.</p>
                <p>Hvis du velger å bruke tjenesten vår, samtykker du til innsamling og bruk av informasjon i henhold til denne policyen. Den personlige informasjonen vi samler inn brukes til å levere og forbedre tjenesten. Vi vil ikke bruke eller dele informasjonen din med noen, bortsett fra som beskrevet i denne personvernpolitikken.</p>
                <p>Betingelsene som brukes i denne personvernpolitikken har de samme betydningene som i våre vilkår og betingelser, som er tilgjengelige på https://tihlde.org, med mindre annet er definert i disse personvernreglene.</p>
                <h3>Innsamling og bruk av informasjon</h3>
                <p>For en bedre opplevelse når du bruker tjenesten vår, kan det hende vi krever at du gir oss personlig identifiserbar informasjon, inkludert, men ikke begrenset til ditt navn, telefonnummer og postadresse. Informasjonen vi samler inn vil bli brukt til å kontakte eller identifisere deg.</p>
                <h3>Loggdata</h3>
                <p>Vi vil informere deg om at hver gang du besøker tjenesten vår, samler vi inn informasjon som nettleseren din sender til oss som kalles loggdata. Disse loggdataene kan inneholde informasjon som datamaskinens IP-adresse (nettprotokoll), nettleserversjon, sider på tjenesten du besøker, klokkeslett og dato for besøket, tidsbruken på disse sidene og annen statistikk.</p>
                <h3>Kapsler </ h3>
                <p>Informasjonskapsler er filer med liten mengde data som ofte brukes en anonym unik identifikator. Disse sendes til nettleseren din fra nettstedet du besøker og er lagret på datamaskinens harddisk.</p>
                <p>Nettstedet vårt bruker disse &quot;informasjonskapslene&quot; for å samle informasjon og for å forbedre tjenesten vår. Ved å fortsette å bruke denne siden godtar du bruken av informasjonskapsler.</p>
                <h3>Tjenesteytere</h3>
                <p>Vi kan ansette tredjepartsbedrifter og enkeltpersoner på grunn av følgende årsaker:</p>
                <ul className={classes.list}>
                  <li>For å lette tjenesten vår;</li>
                  <li>For å tilby tjenesten på våre vegne;</li>
                  <li>For å utføre Tjenester-relaterte tjenester; eller</li>
                  <li>For å hjelpe oss med å analysere hvordan tjenesten vår brukes.</li>
                </ ul>
                <p>Vi vil informere våre tjenestebrukere om at disse tredjepartene har tilgang til din personlige informasjon. Årsaken er å utføre oppgavene som er tildelt dem på våre vegne. De er imidlertid forpliktet til ikke å avsløre eller bruke informasjonen til noe annet formål.</p>
                <h3>Sikkerhet </ h3>
                <p>Vi verdsetter din tillit til å gi oss din personlige informasjon, og vi prøver derfor å bruke kommersielt akseptable metoder for å beskytte den. Men husk at ingen overføringsmetode over internett, eller metode for elektronisk lagring er 100% sikker og pålitelig, og vi kan ikke garantere dets absolutte sikkerhet.</p>
                <h3>Koblinger til andre nettsteder</h3>
                <p>Tjenesten vår kan inneholde lenker til andre nettsteder. Hvis du klikker på en kobling fra tredjepart, blir du ledet til det nettstedet. Merk at disse eksterne nettstedene ikke drives av oss. Derfor anbefaler vi deg på det sterkeste å gjennomgå personvernreglene på disse nettstedene. Vi har ingen kontroll over og påtar oss intet ansvar for innhold, personvernpolitikk eller praksis på tredjeparts nettsteder eller tjenester.</p>
                <p>Barns personvern</p>
                <p>Våre tjenester adresserer ikke personer under 13 år. Vi samler ikke bevisst personlig identifiserbar informasjon fra barn under 13 år. I tilfelle vi oppdager at et barn under 13 år har gitt oss personlig informasjon, sletter vi umiddelbart dette fra serverne våre. Hvis du er forelder eller foresatt og du er klar over at barnet ditt har gitt oss personlig informasjon, vennligst kontakt oss slik at vi kan gjøre nødvendige handlinger.</p>
                <h3>Endringer i denne personvernpolitikken</h3>
                <p>Vi kan oppdatere personvernreglene våre fra tid til annen. Dermed anbefaler vi deg å gjennomgå denne siden med jevne mellomrom for eventuelle endringer. Vi vil varsle deg om endringer ved å legge ut den nye personvernregelen på denne siden. Disse endringene trer i kraft umiddelbart etter at de er lagt ut på denne siden.</p>
                <h3>Kontakt oss</h3>
                <p>Hvis du har spørsmål eller forslag til personvernreglene våre, ikke nøl med å kontakte oss.</p>
              </Paper>
            </div>
          </div>
        </div>
      </Grid>
    </Navigation>
  );
}

PrivacyPolicy.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(PrivacyPolicy);
