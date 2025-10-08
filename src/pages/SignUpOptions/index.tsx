import FEIDE_ICON from '~/assets/icons/feide.svg';
import TihldeLogo from '~/components/miscellaneous/TihldeLogo';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { FEIDE_AUTH_STATE, FEIDE_AUTH_URL, FEIDE_CLIENT_ID, FEIDE_REDIRECT_URI } from '~/constant';
import URLS from '~/URLS';
import { Info } from 'lucide-react';
import { Link } from 'react-router';

const ExternalLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <a className='text-sky-500 font-semibold md:hover:text-sky-700' href={href} rel='noreferrer' target='_blank'>
      {text}
    </a>
  );
};

const SignUpOptions = () => {
  const createFeideSession = () => {
    const url = `${FEIDE_AUTH_URL}?client_id=${FEIDE_CLIENT_ID}&response_type=code&redirect_uri=${FEIDE_REDIRECT_URI}&scope=openid&state=${FEIDE_AUTH_STATE}`;

    window.location.replace(url);
  };

  return (
    <Page>
      <Card className='max-w-2xl w-full mx-auto'>
        <CardContent className='space-y-12 p-4 md:p-8'>
          <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>Opprett bruker hos TIHLDE</h1>
            <p className='text-sm text-muted-foreground'>
              Vi anbefaler å registrere bruker automatisk ved hjelp av Feide. På denne måten vil du få tilgang til TIHLDE sine plattformer umiddelbart. Hvis du
              ikke har Feide bruker enda, eller om det skulle oppstå et problem kan du registrere deg manuelt. Da trenger vi bevis på at du studerer ved ett av
              TIHLDE sine studieretninger for å registrere brukeren din.
            </p>
            <Expandable icon={<Info className='w-6 h-6' />} title='Hvordan få Feide bruker?'>
              <div className='space-y-4 text-sm'>
                <p>
                  For å få Feide bruker må du gjøre følgende (<ExternalLink href='https://i.ntnu.no/wiki/-/wiki/Norsk/Aktiver+brukerkonto' text='les mer her' />
                  ):
                </p>
                <ol className='ml-2 list-inside list-decimal space-y-2'>
                  <li>
                    Er du ny student, vil du få en velkomstmail fra NTNU i uke 31. Etter dette kan du aktivere brukerkontoen din hos Feide. Har du ikke mottatt
                    mailen, kan du enten vente eller registrere deg manuelt.
                  </li>
                  <li>
                    Før du kan aktivere brukerkontoen din, må du{' '}
                    <ExternalLink href='https://i.ntnu.no/wiki/-/wiki/Norsk/Semesteravgift+og+registrering' text='semesterregistrere deg i Studentweb' /> og{' '}
                    <ExternalLink href='https://i.ntnu.no/wiki/-/wiki/Norsk/Semesteravgift+og+registrering' text='betale semesteravgift' />.
                  </li>
                  <li>
                    Aktiver brukerkontoen din hos Feide ved hjelp av <ExternalLink href='https://login.idporten.no/authorize/selector' text='ID-porten' /> eller{' '}
                    <ExternalLink href='https://bas.ntnu.no/international/' text='uten ID-porten' />.
                  </li>
                  <li>Ett døgn etter at du har aktivert brukerkontoen din, får du tilgang til NTNU sine tjenester som Feide-bruker og e-post.</li>
                  <li>Du kan nå aktivere bruker automatisk ved hjelp av Feide.</li>
                </ol>
              </div>
            </Expandable>
          </div>
          <div className='w-full space-y-2 md:space-y-0 md:flex md:items-center md:space-x-4'>
            <Button className='w-full' onClick={createFeideSession} size='lg'>
              <img alt='Feide ikon' className='mr-2 w-5 h-5' src={FEIDE_ICON} />
              Feide
            </Button>
            <Button asChild className='w-full' size='lg' variant='outline'>
              <Link to={URLS.signupForm}>
                <TihldeLogo className='m-0 w-6 h-6 mr-2' size='small' />
                Manuelt
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default SignUpOptions;
