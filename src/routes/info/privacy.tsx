import { createFileRoute, Link } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

export const Route = createFileRoute('/_MainLayout/personvern')({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <Page className='max-w-4xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>Personvernerklæring</CardTitle>
          <p className='text-muted-foreground'>Sist oppdatert: Mars 2026</p>
        </CardHeader>
        <CardContent className='space-y-8'>
          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>1. Behandlingsansvarlig</h2>
            <p>
              TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er behandlingsansvarlig for personopplysninger som samles inn via
              tihlde.org.
            </p>
            <p>
              Kontakt:{' '}
              <a className='text-blue-500 hover:underline' href='mailto:hs@tihlde.org'>
                hs@tihlde.org
              </a>
            </p>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>2. Hvilke personopplysninger vi samler inn</h2>

            <div className='space-y-2'>
              <h3 className='text-xl font-medium'>2.1 Ved registrering</h3>
              <ul className='list-disc list-inside space-y-1 ml-4'>
                <li>Navn (fornavn og etternavn)</li>
                <li>E-postadresse</li>
                <li>Brukernavn (Feide-brukernavn)</li>
                <li>Studieprogram og årskull</li>
                <li>Kjønn (valgfritt)</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h3 className='text-xl font-medium'>2.2 Ved bruk av tjenesten</h3>
              <ul className='list-disc list-inside space-y-1 ml-4'>
                <li>Profilbilde (valgfritt)</li>
                <li>Allergier (ved påmelding til arrangementer med servering)</li>
                <li>Gruppemedlemskap</li>
                <li>Arrangementshistorikk</li>
                <li>Svar på spørreskjemaer</li>
                <li>Badges og aktivitetsdata</li>
                <li>Bio og annen frivillig profilinformasjon</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h3 className='text-xl font-medium'>2.3 Betalingsopplysninger</h3>
              <p>
                Ved betaling for arrangementer behandles betalingen av Vipps AS. Vi lagrer kun informasjon om hvorvidt betaling er gjennomført, ikke
                betalingsdetaljer som kortnummer eller lignende.
              </p>
            </div>

            <div className='space-y-2'>
              <h3 className='text-xl font-medium'>2.4 Automatisk innsamlet informasjon</h3>
              <p>
                Vi bruker Vercel Analytics og PostHog for å samle bruksstatistikk og forbedre brukeropplevelsen. PostHog brukes til sesjonsopptak og analyse,
                men all personlig identifiserbar informasjon (som e-postadresser, navn og andre sensitive data) maskeres automatisk og vises som
                &quot;*****&quot; i opptakene. Dette sikrer at vi kan analysere brukeratferd uten å lagre personopplysninger.
              </p>
            </div>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>3. Formål og rettslig grunnlag</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formål</TableHead>
                  <TableHead>Rettslig grunnlag (GDPR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Medlemsadministrasjon</TableCell>
                  <TableCell>Berettiget interesse (Art. 6(1)(f))</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Arrangementsadministrasjon</TableCell>
                  <TableCell>Avtale (Art. 6(1)(b))</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Allergihåndtering</TableCell>
                  <TableCell>Samtykke (Art. 6(1)(a))</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bildepublisering</TableCell>
                  <TableCell>Samtykke (Art. 6(1)(a))</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nyhetsbrev/varsler</TableCell>
                  <TableCell>Samtykke (Art. 6(1)(a))</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Betalingsbekreftelser</TableCell>
                  <TableCell>Avtale og rettslig forpliktelse (Art. 6(1)(b) og (c))</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>4. Deling av personopplysninger</h2>
            <p>Vi deler personopplysninger med følgende tredjeparter:</p>
            <ul className='list-disc list-inside space-y-1 ml-4'>
              <li>
                <strong>Feide/NTNU:</strong> For autentisering ved innlogging
              </li>
              <li>
                <strong>Vipps AS:</strong> For betalingsbehandling
              </li>
              <li>
                <strong>Vercel:</strong> Hosting og anonymisert analyse
              </li>
              <li>
                <strong>PostHog:</strong> Sesjonsopptak og analyse (persondata maskeres automatisk)
              </li>
              <li>
                <strong>Discord (valgfritt):</strong> Ved kobling av Discord-konto
              </li>
            </ul>
            <p>Vi selger aldri personopplysninger til tredjeparter og deler kun data som er nødvendig for tjenestens funksjon.</p>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>5. Oppbevaring</h2>
            <ul className='list-disc list-inside space-y-1 ml-4'>
              <li>
                <strong>Brukerkontoer:</strong> Så lenge kontoen er aktiv
              </li>
              <li>
                <strong>Arrangementsdata:</strong> 3 år etter arrangementsdato
              </li>
              <li>
                <strong>Betalingsbekreftelser:</strong> 5 år (regnskapskrav)
              </li>
              <li>
                <strong>Botsystem-data:</strong> Så lenge brukeren er medlem av gruppen
              </li>
            </ul>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>6. Dine rettigheter</h2>
            <p>Du har følgende rettigheter under GDPR:</p>
            <ul className='list-disc list-inside space-y-2 ml-4'>
              <li>
                <strong>Innsyn:</strong> Du kan eksportere all din data under &quot;Innstillinger&quot; i profilen
              </li>
              <li>
                <strong>Retting:</strong> Du kan redigere din informasjon i profilen
              </li>
              <li>
                <strong>Sletting:</strong> Du kan slette din konto under &quot;Innstillinger&quot; i profilen
              </li>
              <li>
                <strong>Dataportabilitet:</strong> Eksporter din data i maskinlesbart format via profilen
              </li>
              <li>
                <strong>Protest:</strong> Kontakt oss for å protestere mot behandling
              </li>
              <li>
                <strong>Trekke samtykke:</strong> Du kan når som helst endre samtykkeinnstillinger i profilen
              </li>
            </ul>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>7. Informasjonskapsler (cookies)</h2>
            <p>Vi bruker kun teknisk nødvendige informasjonskapsler for å holde deg innlogget. Disse krever ikke samtykke etter ePrivacy-direktivet.</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Formål</TableHead>
                  <TableHead>Varighet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>access_token</TableCell>
                  <TableCell>Autentisering</TableCell>
                  <TableCell>Sesjonsbasert</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>refresh_token</TableCell>
                  <TableCell>Fornyet autentisering</TableCell>
                  <TableCell>30 dager</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>8. Sikkerhet</h2>
            <p>Vi tar datasikkerhet på alvor og har implementert følgende tiltak:</p>
            <ul className='list-disc list-inside space-y-1 ml-4'>
              <li>Kryptert kommunikasjon (HTTPS)</li>
              <li>Sikker lagring av passord (hashing)</li>
              <li>Tilgangskontroll basert på roller</li>
              <li>Regelmessige sikkerhetsoppdateringer</li>
            </ul>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>9. Kontakt og klage</h2>
            <p>
              For spørsmål om personvern eller for å utøve dine rettigheter, kontakt oss på{' '}
              <a className='text-blue-500 hover:underline' href='mailto:hs@tihlde.org'>
                hs@tihlde.org
              </a>
              .
            </p>
            <p>
              Du har også rett til å klage til Datatilsynet:{' '}
              <a className='text-blue-500 hover:underline' href='https://www.datatilsynet.no' rel='noopener noreferrer' target='_blank'>
                www.datatilsynet.no
              </a>
            </p>
          </section>

          <Separator />

          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>10. Endringer</h2>
            <p>
              Denne personvernerklæringen kan oppdateres ved behov. Ved vesentlige endringer vil vi informere brukere via e-post eller på nettsiden. Du kan
              sjekke endringshistorikk i vår{' '}
              <Link className='text-blue-500 hover:underline' to='/endringslogg'>
                endringslogg
              </Link>
              .
            </p>
          </section>
        </CardContent>
      </Card>
    </Page>
  );
}
