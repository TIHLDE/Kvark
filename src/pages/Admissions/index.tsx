import { createFileRoute } from '@tanstack/react-router';
import { authClientWithRedirect } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { useGroupsByType } from '~/hooks/Group';
import useMediaQuery, { LARGE_SCREEN } from '~/hooks/MediaQuery';
import type { GroupList } from '~/types';

import GroupAdmission, { GroupAdmissionLoading } from './components/GroupAdmission';

export const Route = createFileRoute('/_MainLayout/opptak')({
  async beforeLoad({ location }) {
    await authClientWithRedirect(location.href);
  },
  component: Admissions,
});

function Admissions() {
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS, isLoading } = useGroupsByType({ overview: true });

  const isDesktop = useMediaQuery(LARGE_SCREEN);

  type CollectionProps = {
    groups: Array<GroupList>;
    title: string;
    disabled?: boolean;
  };

  const Collection = ({ groups, title, disabled }: CollectionProps) => (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>{title}</h1>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-baseline'>
        {groups.map((group, index) => (
          <GroupAdmission disabled={disabled} group={group} key={index} />
        ))}
      </div>
    </div>
  );

  const AdmissionInfos: AdmissionInfoProps[] = [
    {
      title: 'Hovedorgan',
      description:
        'Hovedorganet er TIHLDEs øverste organ, og består av styret og forvaltningsgruppen. Hovedstyret består av president, visepresident, økonomiminister, og ministerposter fra hver av undergruppene. Man kan ikke søke direkte til hovedstyret. Hovedstyret blir bestemt på generalforsamlingene. Forvaltningsgruppen derimot kan man søke til direkte.',
    },
    {
      title: 'Undergrupper',
      description:
        'Undergruppene er TIHLDEs kjernevirksomhet. Her skjer det meste av aktiviteten. Undergruppene har egne lederverv og styrer seg selv. På grunnlag av dette er det ikke lov til å være med i mer enn én undergruppe samtidig. Selv om du kun kan være med i en undergruppe, anbefaler vi at du søker på verv i alle undergrupper du interesserer deg for.',
    },
    {
      title: 'Komitéer',
      description:
        'Komitéene er TIHLDEs støtteapparat. I likhet med undergruppene utgjør de en viktig rolle i TIHLDE, men det krever litt mindre arbeid. Komitéene har også egne lederverv og styrer seg selv. Det er mulig å være med i flere komitéer samtidig, og vi anbefaler at du søker på verv i alle komitéer du interesserer deg for. Man kan også være med i en undergruppe og en komité samtidig.',
    },
  ];

  type AdmissionInfoProps = {
    title: string;
    description: string;
  };

  const AdmissionInfo = ({ title, description }: AdmissionInfoProps) => (
    <div className='space-y-2'>
      <h1 className='lg:text-lg font-bold text-sky-500'>{title}</h1>
      <p className='text-sm lg:text-base text-slate-700 dark:text-slate-300'>{description}</p>
    </div>
  );

  return (
    <Page className='pt-0 space-y-20'>
      <div className='lg:h-[50vh] relative z-0 flex items-center flex-col text-center pt-20'>
        <div className='h-96 w-24 rotate-45 bg-indigo-400/40 blur-3xl absolute -bottom-24 left-1 z-0' />
        <div className='h-72 lg:h-96 w-72 lg:w-96  bg-cyan-400/10 blur-3xl absolute -bottom-64 right-0 z-0' />
        <div className='h-96 w-96 bg-cyan-400/30 blur-3xl absolute -top-[350px] lg:-top-[450px] right-48 z-0' />
        {isDesktop && <div className='h-96 w-96 bg-cyan-400/30 blur-3xl absolute -bottom-[250px] left-1/2' />}
        <h1 className='text-center text-3xl lg:text-6xl font-bold max-w-3xl mb-4'>Søk verv!</h1>
        <p className='dark:text-slate-300 text-slate-700 max-w-2xl mb-8'>
          Her finner du en oversikt over alle vervene i TIHLDE. Søk på vervene du er interessert i, og bli med på å skape et bedre studentmiljø!
        </p>
      </div>
      <div className='bg-black/5 dark:bg-slate-950/30 border items-center py-12 lg:py-16 px-8 lg:px-16 rounded-3xl z-10 relative'>
        <div className='space-y-12 md:space-y-20'>
          <div className='space-y-4 max-w-xl w-full'>
            <h1 className='text-3xl md:text-5xl font-bold'>Hva er verv?</h1>
            <p className='text-sm md:text-base text-slate-700 dark:text-slate-300'>
              Et verv er en oppgave eller et ansvar som du får tildelt i TIHLDE. Et verv gir deg muligheten til å være med på å skape et bedre studentmiljø, og
              du lærer mye nyttig underveis som du vil ta med deg resten av livet.
            </p>
          </div>
          <div className='grid lg:grid-cols-3 gap-12'>
            {AdmissionInfos.map((info, index) => (
              <AdmissionInfo key={index} {...info} />
            ))}
          </div>
        </div>
      </div>

      <div className='text-center flex flex-col justify-center relative z-0'>
        <div className='h-96 w-24 rotate-45 bg-emerald-400/30 dark:bg-emerald-900/40 blur-3xl absolute -top-24 left-1 z-0' />
        <div className='h-72 lg:h-96 w-72 lg:w-96 bg-cyan-400/10 dark:bg-cyan-900/20 blur-3xl absolute -bottom-64 right-0 z-0' />
        <div className='h-96 w-96 bg-indigo-300/20 dark:bg-indigo-900/30 blur-3xl absolute top-0 right-4 z-0' />
        <h2 className='text-xl md:text-5xl font-semibold max-w-5xl mx-auto'>Det er mange verv å velge mellom!</h2>
        <p className='text-slate-700 dark:text-slate-300 max-w-lg mt-6 mx-auto pb-12'>
          Du vil bli kalt inn til intervju etter søknadsfristen, for alle verv du har søkt på.
        </p>
        <div className='space-y-16'>
          {isLoading && (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {Array.from({ length: 12 }).map((_, index) => (
                <GroupAdmissionLoading key={index} />
              ))}
            </div>
          )}
          {Boolean(BOARD_GROUPS.length) && <Collection groups={BOARD_GROUPS} title='Hovedorgan' />}
          {Boolean(SUB_GROUPS.length) && <Collection groups={SUB_GROUPS} title='Undergrupper' />}
          {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komitéer' />}
        </div>
      </div>

      <div className='text-center flex flex-col justify-center'>
        <h2 className='text-xl md:text-5xl font-semibold max-w-5xl mx-auto'>Interessegrupper</h2>
        <p className='text-slate-700 dark:text-slate-300 max-w-xl mt-6 mx-auto pb-12'>
          TIHLDE har flere interessegrupper som du kan bli med i. Her kan du drive med det du er interessert i, eller lære noe nytt. Interessegruppene er åpne
          for alle, og du kan være med i så mange du vil.
        </p>
        <div className='space-y-16'>
          {isLoading && (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {Array.from({ length: 12 }).map((_, index) => (
                <GroupAdmissionLoading key={index} />
              ))}
            </div>
          )}
          {Boolean(INTERESTGROUPS.length) && <Collection disabled groups={INTERESTGROUPS} title='Interessegrupper' />}
        </div>
      </div>
    </Page>
  );
}
