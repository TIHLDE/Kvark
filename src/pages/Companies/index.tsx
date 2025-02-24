import InfoCard from '~/components/layout/InfoCard';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import CompaniesForm from '~/pages/Companies/components/CompaniesForm';
import { UserStudy } from '~/types/Enums';
import URLS from '~/URLS';
import { getUserStudyLong } from '~/utils';
import { Mail } from 'lucide-react';
import { useRef } from 'react';

const Companies = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    !formRef.current || window.scroll({ top: formRef.current.offsetTop - 84, left: 0, behavior: 'smooth' });
  };

  const text = {
    aboutUs: `TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Informasjonsbehandling, samt masterstudiet Digital transformasjon ved AIT, IDI, NTNU på Gløshaugen.`,
    dataing: `Dataingeniør-studiet kombinerer det beste fra de spesialiserte informatikkutdanningene og de tradisjonelle ingeniørutdanningene.
Det legger mye vekt på praktisk utvikling av systemer og programmer, og studentene får et godt grunnlag i datateknikk, matematikk og teknisk-naturvitenskapelige fag, samt varig og verdifull kompetanse om hvordan datateknikk kan benyttes.`,
    info: `Dette digitale bachelorstudiet kvalifiserer studenter til å tilrettelegge og organisere informasjon i en virksomhet. Man får kunnskap om programmering, webløsninger og datasikkerhet.`,
    digsec: `Dette bachelorstudiet setter fokus på den drift-tekniske IKT-kompetansen bedrifter etterspør. Studentene lærer planleggingsprosesser og oppsett av virtuelle maskiner med bruk av teknologier som VMWare og HyperV. Videre temaer i studiet er Linux, Windows Server, “Cloud Computing” og overvåkning og sikkerhet i digital infrastruktur.`,
    digsam: `Digital transformasjon er et veletablert forskningsområde som tar for seg hvordan utøvelse og koordinering av samarbeidsaktiviteter kan støttes ved hjelp av ulike IKT-systemer. Studentene ved denne 2 årige masteren er i stand til å samhandle effektivt i forskjellige tverrfaglige problemløsningsprosesser.`,
    digfor: `Digital forretningsutvikling kombinerer IT, økonomi og ledelse for å skape forretningsutviklere med tverrfaglig kompetanse. For at samfunnet skal digitaliseres er det nødvendig med ledere som har både teknisk og økonomisk kompetanse. Digital forretningsutvikling er lagt opp med høyt fokus på praktisk erfaring innenfor teamarbeid og kommunikasjon. Studiet søker å utdanne dyktige endringsagenter som kan effektivisere arbeidsprosesser og implementere digitale løsninger i bedrifter.`,
    ads: `Vi tilbyr promotering av stillingsannonser ut til våre 600 dyktige studenter på vår [karriereside](${URLS.jobposts}).`,
    course: `Et kurs er et faglig arrangement hvor fokuset skal være på å introdusere studentene for faglige erfaringer som de kan få bruk for i arbeidslivet. Kurset kan inneholde en rask presentasjon av bedriften før kurset starter. Vi legger tilrette for matservering på skolen etter kurset, eller bespisning på restaurant i etterkant.`,
    companyTrips: `Under et bedriftsbesøk reiser studentene til bedriftens lokale for et valgfritt arrangement. Et bedriftsbesøk gir dere som bedrift muligheten til å vise studentene frem hvor de kan jobbe, og bli godt kjent med dem. `,
    companies: `En bedriftspresentasjon gir dere som organisasjon mulighet til å presentere dere for TIHLDE sine studenter. Dette er en gylden mulighet til å gjøre studentene bevisst på hvem dere er, hva dere tilbyr og hvordan dere jobber.
Etter selve presentasjonen reiser vi sammen ned til en resturant for bespisning og mingling med bedriftsrepresentantene.
Vi kan også tilrettelegge for speed intervjuer dersom dette er ønskelig.`,
    instatakeover: `Ved insta-takeover får bedriften ta over instagrammen vår en hel dag. Dere vil få muligheten til å fremme bedriften på valgfri måte, og nå ut direkte til studentene.`,
    trip: `På høsten gjennomfører vi i TIHLDE en bedriftsekskursjon til Oslo med 60 av studentene våre”. Dette er en god mulighet for bedriften å vise fram sine lokaler, og bli bedre kjent med studentene. Etter selve besøket så legger vi til rette for bespisning og mingling.`,
  };

  return (
    <Page className='space-y-12'>
      <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl lg:text-5xl font-bold'>For bedrifter</h1>
          <p className='text-muted-foreground'>Alle arrangementer kan gjennomføres digitalt</p>
        </div>

        <Button onClick={scrollToForm}>
          <Mail className='mr-2 h-5 w-5 stroke-[1.5px]' />
          Send oss en melding
        </Button>
      </div>

      <div className='space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-2xl'>Vi tilbyr</h1>
          <div className='grid lg:grid-cols-2 gap-4'>
            <InfoCard header='Bedriftspresentasjon' text={text.companies} />
            <InfoCard header='Kurs / Workshop' text={text.course} />
            <InfoCard header='Bedriftsbesøk' text={text.companyTrips} />
            <InfoCard header='Annonse' text={text.ads} />
            <InfoCard header='Insta-takeover' text={text.instatakeover} />
            <InfoCard header='Bedriftsekskursjon' text={text.trip} />
          </div>
        </div>

        <div className='space-y-2'>
          <h1 className='text-2xl'>Studier</h1>
          <div className='grid lg:grid-cols-2 gap-4'>
            <InfoCard header={getUserStudyLong(UserStudy.DATAING)} text={text.dataing} />
            <InfoCard header={getUserStudyLong(UserStudy.DIGSEC)} text={text.digsec} />
            <InfoCard header={getUserStudyLong(UserStudy.DIGFOR)} text={text.digfor} />
            <InfoCard header={getUserStudyLong(UserStudy.DIGSAM)} text={text.digsam} />
            <InfoCard header={getUserStudyLong(UserStudy.INFO)} text={text.info} />
          </div>
        </div>

        <div className='space-y-2' ref={formRef}>
          <h1 className='text-2xl'>Meld interesse</h1>
          <CompaniesForm />
        </div>

        <InfoCard header='Om TIHLDE' text={text.aboutUs} />
      </div>
    </Page>
  );
};

export default Companies;
