import { createFileRoute } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ExternalLink } from '~/components/ui/external-link';
import { useGroups } from '~/hooks/Group';
import { GroupType } from '~/types/Enums';
import { ArrowRight, HandCoins, Info, Plus } from 'lucide-react';
import { useMemo } from 'react';

import GroupItem from '../Groups/overview/GroupItem';

export const Route = createFileRoute('/_MainLayout/interessegrupper')({
  component: InterestGroups,
});

function InterestGroups() {
  const { data } = useGroups({ overview: true });
  const groups = useMemo(() => data?.filter((group) => group.type === GroupType.INTERESTGROUP) ?? [], [data]);
  return (
    <Page>
      <Card>
        <CardHeader>
          <CardTitle>Interessegrupper</CardTitle>
          <CardDescription>Her finner du en oversikt over alle interessegruppene i TIHLDE. Trykk på en gruppe for å se mer informasjon om den.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-8 md:space-y-12'>
            <div className='grid md:grid-cols-3 gap-4 items-stretch'>
              <ExternalLink href='https://wiki.tihlde.org/struktur#interessegrupper'>
                <Alert className='hover:bg-secondary transition-all duration-150 ease-in-out h-full'>
                  <Info />
                  <AlertTitle>Hva er en interessegruppe?</AlertTitle>
                  <AlertDescription className='space-y-4'>
                    <p>Lær mer om hva det innebærer å ha en interessegruppe på vår wiki.</p>
                    <div className='flex items-center space-x-2 justify-end'>
                      <p>Les mer</p>
                      <ArrowRight className='w-4 h-4' />
                    </div>
                  </AlertDescription>
                </Alert>
              </ExternalLink>

              <ExternalLink href='https://drive.google.com/file/d/1Y4VDE8yUiIwpg5Vow6SBuO6QxnrDzagl/edit'>
                <Alert className='hover:bg-secondary transition-all duration-150 ease-in-out'>
                  <Plus />
                  <AlertTitle>Opprett interessegruppe</AlertTitle>
                  <AlertDescription className='space-y-4'>
                    <p>Har du en god ide for en interessegruppe? Fyll ut vårt søknadsskjema for å opprette en ny gruppe.</p>
                    <div className='flex items-center space-x-2 justify-end'>
                      <p>Les mer</p>
                      <ArrowRight className='w-4 h-4' />
                    </div>
                  </AlertDescription>
                </Alert>
              </ExternalLink>

              <ExternalLink href='https://wiki.tihlde.org/soknader-okonomisk#stotte-fra-hs'>
                <Alert className='hover:bg-secondary transition-all duration-150 ease-in-out'>
                  <HandCoins />
                  <AlertTitle>Søk om pengestøtte</AlertTitle>
                  <AlertDescription className='space-y-4'>
                    <p>Interessegrupper har muligheten til å søke om finansiell støtte.</p>
                    <div className='flex items-center space-x-2 justify-end'>
                      <p>Les mer</p>
                      <ArrowRight className='w-4 h-4' />
                    </div>
                  </AlertDescription>
                </Alert>
              </ExternalLink>
            </div>

            <div className='space-y-4'>
              <h1 className='font-semibold text-2xl'>Grupper</h1>
              <div className='grid md:grid-cols-2 gap-4'>
                {groups.map((group, index) => (
                  <GroupItem group={group} key={index} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
