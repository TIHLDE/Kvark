import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import Page from '~/components/navigation/Page';
import { getGroupsQuery } from '~/api/queries/groups';
import type { GroupList } from '~/types';
import { GroupType } from '~/types/Enums';

import GroupAdmission, { GroupAdmissionLoading } from '~/routes/groups/components/GroupAdmission';

// TODO: Re-add auth protection — previously used authClientWithRedirect() / userHasWritePermission(PermissionApp.GROUP)

export const Route = createFileRoute('/_MainLayout/opptak')({
  component: Admissions,
});

function Admissions() {
  // useSuspenseQuery suspends instead of returning isLoading=true
  const { data } = useSuspenseQuery(getGroupsQuery(0, {}, 200));
  const groups = (Array.isArray(data) ? data : []) as unknown as GroupList[];
  const isLoading = false;

  const BOARD_GROUPS = groups.filter((g) => g.type === GroupType.BOARD);
  const SUB_GROUPS = groups.filter((g) => g.type === GroupType.SUBGROUP);
  const COMMITTEES = groups.filter((g) => g.type === GroupType.COMMITTEE);
  const INTERESTGROUPS = groups.filter((g) => g.type === GroupType.INTERESTGROUP || g.type === GroupType.SPORTSTEAM);

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

  type AdmissionInfoProps = {
    title: string;
    description: string;
  };

  const AdmissionInfos: AdmissionInfoProps[] = [
    {
      title: 'Hovedorgan',
      description:
        'Hovedorganet er TIHLDEs overste organ, og bestar av styret og forvaltningsgruppen. Hovedstyret bestar av president, visepresident, okonomiminister, og ministerposter fra hver av undergruppene. Man kan ikke soke direkte til hovedstyret. Hovedstyret blir bestemt pa generalforsamlingene. Forvaltningsgruppen derimot kan man soke til direkte.',
    },
    {
      title: 'Undergrupper',
      description:
        'Undergruppene er TIHLDEs kjernevirksomhet. Her skjer det meste av aktiviteten. Undergruppene har egne lederverv og styrer seg selv. Pa grunnlag av dette er det ikke lov til a vaere med i mer enn en undergruppe samtidig. Selv om du kun kan vaere med i en undergruppe, anbefaler vi at du soker pa verv i alle undergrupper du interesserer deg for.',
    },
    {
      title: 'Komiteer',
      description:
        'Komiteene er TIHLDEs stotteapparat. I likhet med undergruppene utgjor de en viktig rolle i TIHLDE, men det krever litt mindre arbeid. Komiteene har ogsa egne lederverv og styrer seg selv. Det er mulig a vaere med i flere komiteer samtidig, og vi anbefaler at du soker pa verv i alle komiteer du interesserer deg for. Man kan ogsa vaere med i en undergruppe og en komite samtidig.',
    },
  ];

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
        <div className='h-72 lg:h-96 w-72 lg:w-96 bg-cyan-400/10 blur-3xl absolute -bottom-64 right-0 z-0' />
        <div className='h-96 w-96 bg-cyan-400/30 blur-3xl absolute -top-[350px] lg:-top-[450px] right-48 z-0' />
        {/* Replaced useMediaQuery(LARGE_SCREEN) with Tailwind responsive class */}
        <div className='hidden lg:block h-96 w-96 bg-cyan-400/30 blur-3xl absolute -bottom-[250px] left-1/2' />
        <h1 className='text-center text-3xl lg:text-6xl font-bold max-w-3xl mb-4'>Sok verv!</h1>
        <p className='dark:text-slate-300 text-slate-700 max-w-2xl mb-8'>
          Her finner du en oversikt over alle vervene i TIHLDE. Sok pa vervene du er interessert i, og bli med pa a skape et bedre studentmiljo!
        </p>
      </div>
      <div className='bg-black/5 dark:bg-slate-950/30 border items-center py-12 lg:py-16 px-8 lg:px-16 rounded-3xl z-10 relative'>
        <div className='space-y-12 md:space-y-20'>
          <div className='space-y-4 max-w-xl w-full'>
            <h1 className='text-3xl md:text-5xl font-bold'>Hva er verv?</h1>
            <p className='text-sm md:text-base text-slate-700 dark:text-slate-300'>
              Et verv er en oppgave eller et ansvar som du far tildelt i TIHLDE. Et verv gir deg muligheten til a vaere med pa a skape et bedre studentmiljo, og
              du laerer mye nyttig underveis som du vil ta med deg resten av livet.
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
        <h2 className='text-xl md:text-5xl font-semibold max-w-5xl mx-auto'>Det er mange verv a velge mellom!</h2>
        <p className='text-slate-700 dark:text-slate-300 max-w-lg mt-6 mx-auto pb-12'>
          Du vil bli kalt inn til intervju etter soknadsfristen, for alle verv du har sokt pa.
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
          {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komiteer' />}
        </div>
      </div>

      <div className='text-center flex flex-col justify-center'>
        <h2 className='text-xl md:text-5xl font-semibold max-w-5xl mx-auto'>Interessegrupper</h2>
        <p className='text-slate-700 dark:text-slate-300 max-w-xl mt-6 mx-auto pb-12'>
          TIHLDE har flere interessegrupper som du kan bli med i. Her kan du drive med det du er interessert i, eller laere noe nytt. Interessegruppene er apne
          for alle, og du kan vaere med i sa mange du vil.
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
