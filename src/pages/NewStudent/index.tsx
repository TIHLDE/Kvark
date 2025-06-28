import Page from '~/components/navigation/Page';
import useMediaQuery, { LARGE_SCREEN, MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import { useIsAuthenticated } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';
import { ArrowRight, AtSign, FacebookIcon, InstagramIcon, Users2 } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router';

import { Button } from '../../components/ui/button';
import { useGroupsByType } from '../../hooks/Group';
import { useToddels } from '../../hooks/Toddel';
import { GroupList } from '../../types/Group';
import GroupItem from '../Groups/overview/GroupItem';

const NewStudent = () => {
  const { event } = useAnalytics();
  const isAuthenticated = useIsAuthenticated();

  const isDesktop = useMediaQuery(LARGE_SCREEN);
  const isTablet = useMediaQuery(MEDIUM_SCREEN);

  const { data: toddelsData } = useToddels();
  const toddels = useMemo(() => (toddelsData ? toddelsData.pages.map((page) => page.results).flat() : []), [toddelsData]);

  const fadderukaSignupAnalytics = () => event('signup-fadderuka', 'new-student', 'Clicked on link to signup for fadderuka');
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS } = useGroupsByType({ overview: true });

  type CollectionProps = {
    groups: Array<GroupList>;
    title: string;
  };
  const contacts = [
    { icon: AtSign, text: 'hs@tihlde.org', url: 'mailto:hs@tihlde.org' },
    { icon: AtSign, text: 'fadderkom@tihlde.org', url: 'mailto:fadderkom@tihlde.org' },
    { icon: InstagramIcon, text: '@tihlde', url: 'https://www.instagram.com/tihlde/' },
    { icon: FacebookIcon, text: 'TIHLDE', url: 'https://www.facebook.com/tihlde/' },
  ];
  const Collection = ({ groups, title }: CollectionProps) => (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>{title}</h1>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {groups.map((group, index) => (
          <GroupItem group={group} key={index} />
        ))}
      </div>
    </div>
  );
  return (
    <Page className='pt-0'>
      <div className='h-[70vh] relative z-0 flex justify-center items-center flex-col text-center'>
        <div className='h-96 w-24 rotate-45 bg-cyan-400/40 blur-3xl absolute -bottom-24 left-1 z-0' />
        <div className='h-72 lg:h-96 w-72 lg:w-96  bg-cyan-400/10 blur-3xl absolute -bottom-64 right-0 z-0' />
        <div className='h-96 w-96 bg-cyan-400/30 blur-3xl absolute -top-[350px] lg:-top-[450px] right-48 z-0' />
        {isDesktop && <div className='h-96 w-96 bg-cyan-400/30 blur-3xl absolute -bottom-[250px] left-1/2' />}
        <h1 className='text-center text-3xl lg:text-6xl font-bold max-w-3xl mb-4'>
          Velkommen til <br /> linjeforeningen TIHLDE!
        </h1>
        <p className='dark:text-slate-300 text-slate-700 max-w-2xl mb-8'>
          Her finner du nyttig info om hvordan linjeforeningen og fadderuka fungerer. Om du er ny student kan du melde deg på under. Du burde også lage deg en
          bruker om du ikke har gjort dette allerede.
        </p>
        <div className='flex flex-col md:flex-row gap-2'>
          <a href='https://forms.gle/oJa8sQrkQfGq6vcNA' rel='noreferrer' target='_blank'>
            <Button className='font-semibold  bg-sky-500 text-white'>
              Meld meg på fadderuka <Users2 className='h-4' />
            </Button>
          </a>
          <Button asChild variant={'outline'}>
            <Link to={isAuthenticated ? URLS.admissions : '/ny-bruker'}>
              {isAuthenticated ? 'Søk verv' : 'Opprett Bruker'} <ArrowRight className='h-4' />
            </Link>
          </Button>
        </div>
      </div>
      <div className='bg-black/5 dark:bg-slate-950/30 border items-center py-12 lg:py-24 px-8 lg:px-16 rounded-3xl z-10 relative grid grid-cols-1 md:grid-cols-2 lg:gap-12'>
        <div>
          <h2 className='md:text-sm text-xs text-sky-500'>Ditt første møte med TIHLDE</h2>
          <h2 className='text-3xl md:text-5xl font-bold'>Fadderuka</h2>
          <p className='text-slate-700 dark:text-slate-300 my-4'>
            Fadderuka er en gyllen mulighet til å bli kjent med medstudenter og med linjeforeningen. Fadderuka varer fra uka før skolestart til en uke inn i
            semesteret, som i år er fra 11. - 24. August. Meld deg på her for å få plass!
          </p>
          <div className='flex gap-2 flex-col md:flex-row'>
            <Button asChild className='bg-sky-500 text-white font-semibold' onClick={fadderukaSignupAnalytics}>
              <a href='https://forms.gle/oJa8sQrkQfGq6vcNA' rel='noreferrer' target='_blank'>
                Meld meg på!
              </a>
            </Button>
            <Button asChild className='bg-sky-500 text-white font-semibold'>
              <Link to='/arrangementer/?&expired=false&category=10&activity=false'>Hva skjer i Fadderuka?</Link>
            </Button>
            <Button asChild variant='ghost'>
              <Link to='/wiki/ny-student/'>
                Les mer <ArrowRight className='h-4' />
              </Link>
            </Button>
          </div>
        </div>
        {isTablet && (
          <svg className='w-full' fill='none' height='400' viewBox='0 0 590 400' width='590' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M445.67 319.838C440.961 320.857 436.567 322.711 432.637 325.251L377.686 270.3L307.386 200L432.637 74.7495C436.567 77.2892 440.961 79.1432 445.67 80.1624V319.838ZM414.821 350.687H175.183C174.145 345.978 172.291 341.584 169.751 337.635L295.002
             212.384L350.008 267.39L420.254 337.635C417.713 341.584 415.859 345.978 414.821 350.687ZM157.367 325.251C153.418 322.711 149.025 320.857 144.316 319.819V80.1813C149.025 79.1432 153.418 77.2892 157.367 74.7495L282.618 200L157.367 325.251ZM175.183 49.3139H414.821C415.859 54.0234 417.713 58.4158 420.254 62.3664L295.002 187.616L169.751 62.3664C172.291 58.4158 174.145 54.0234 175.183 49.3139ZM463.19 319.819V80.1813C481.378 76.1765 495.003 59.9554 495.003 40.563C495.003 18.1686 476.835 0 454.439 0C435.048 0 418.825 13.6258 414.821 31.8134H175.183C171.179 13.6258 154.957 0 135.566 0C113.171 0 95.002 18.1686 95.002 40.563C95.002 59.9554 108.609 76.1589 126.796 80.1624V319.838C108.609 323.842 95.002 340.045 95.002 359.438C95.002 381.833 113.171 400 135.566 400C154.957 400 171.179 386.376 175.183 368.188H414.821C418.825 386.376 435.048 400 454.439 400C476.835 400 495.003 381.833 495.003 359.438C495.003 340.045 481.378 323.823 463.19 319.819Z'
              fill='white'
            />
            <path
              d='M589.605 181.373C589.605 181.373 545.74 240.309 463.186 262.611C457.53 264.151 451.692 265.503 445.666 266.653C429.111 269.842 411.183 271.492 391.94 270.954C387.379 270.824 382.633 270.621 377.682 270.305C369.007 269.748 359.774 268.859 350.004
             267.394C324.938 263.649 296.463 256.271 265.577 241.811C261.313 239.827 257.011 237.695 252.654 235.433C251.449 234.803 250.245 234.19 249.04 233.579C223.549 220.528 197.019 210.089 144.312 207.327C138.769 207.05 132.948 206.845 126.792 206.716C123.715 206.661 120.545 206.642 117.281 206.623C88.0455 206.512 0.392578 222.325 0.392578 222.325C0.392578 222.325 44.2556 163.409 126.792 141.086C132.447 139.567 138.286 138.196 144.312 137.064C160.887 133.856 178.814 132.207 198.075 132.745C203.842 132.911 209.904 133.189 216.282 133.672C225.106 134.338 234.487 135.377 244.386 137.008C267.691 140.827 293.793 147.854 321.918 160.701C326.997 163.037 332.151 165.541 337.361 168.266C337.75 168.469 338.139 168.673 338.529 168.858C364.799 182.503 391.291 193.516 445.666 196.37C451.209 196.667 457.03 196.872 463.186 197.002C466.281 197.038 469.47 197.075 472.734 197.094C501.952 197.186 589.605 181.373 589.605 181.373Z'
              fill='white'
            />
          </svg>
        )}
      </div>
      <div className='max-w-5xl mx-auto py-32 lg:py-44'>
        <h2 className='text-sm text-sky-500 mb-2'>Hva er egentlig TIHLDE?</h2>
        <p className='dark:text-slate-400 text-slate-800 font-normal md:text-3xl leading-relaxed'>
          “TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Digital infrastruktur og
          cybersikkerhet, Digital forretningsutvikling, samt masterstudiet Digital transformasjon og det nettbaserte studiet Informasjonsbehandling.”
        </p>
      </div>
      <div className='text-center flex flex-col justify-center'>
        <h2 className='text-xl md:text-5xl font-semibold max-w-5xl mx-auto'>
          TIHLDE er drevet av frivillige studenter - bli kjent med de forskjellige vervene
        </h2>
        <p className='text-slate-700 dark:text-slate-300 max-w-lg mt-6 mx-auto pb-12'>
          Inntaksrunder skjer rett etter fadderuka. Du blir kalt inn på intverju ved å sende søknad.
        </p>
        <div className='space-y-16'>
          {Boolean(BOARD_GROUPS.length) && <Collection groups={BOARD_GROUPS} title='Hovedorgan' />}
          {Boolean(SUB_GROUPS.length) && <Collection groups={SUB_GROUPS} title='Undergrupper' />}
          {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komitéer' />}
          {Boolean(INTERESTGROUPS.length) && <Collection groups={INTERESTGROUPS} title='Interessegrupper' />}
        </div>
      </div>
      <div className='py-32 lg:py-44'>
        <h2 className='text-2xl md:text-5xl font-semibold mx-auto text-center pb-8'>
          TIHLDEs avis heter Töddel <br /> - les siste utgave her
        </h2>
        {toddels && toddels[0] && (
          <Link className='max-w-5xl w-full mx-auto' to='/toddel'>
            <img alt={toddels[0].title} className='rounded-3xl max-w-3xl w-full mx-auto' src={toddels[0].image} />
          </Link>
        )}
      </div>
      <div>
        <h2 className='text-2xl md:text-5xl font-semibold text-center mb-8'>
          Har du noen fler spørsmål? <br /> Ta kontakt her
        </h2>
        <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 '>
          {contacts.map((contact, index) => (
            <a
              className='rounded-lg w-full flex flex-col items-center self-center justify-self-center bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 p-6'
              href={contact.url}
              key={index}
              rel='noreferrer'
              target='_blank'>
              {<contact.icon className='h-12 w-12 lg:h-32 lg:w-32 mb-4' />}
              <p className='dark:text-slate-300 text-slate-700 text-sm lg:text-base'>{contact.text}</p>
            </a>
          ))}
        </div>
      </div>
    </Page>
  );
};

export default NewStudent;
