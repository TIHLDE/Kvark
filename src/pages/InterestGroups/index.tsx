import API from '~/api/api';
import Page from '~/components/navigation/Page';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { GroupType } from '~/types/Enums';
import { ArrowRight, HandCoins, Info, Plus } from 'lucide-react';
import { Link } from 'react-router';

import GroupItem from '../Groups/overview/GroupItem';
import type { Route } from './+types';

async function getInterestGroups() {
  const groups = await API.getGroups({ overview: true });

  return groups.filter((group) => group.type === GroupType.INTERESTGROUP) ?? [];
}

let OverviewCache: { expire: Date; data: Awaited<ReturnType<typeof getInterestGroups>> } | undefined;

export async function clientLoader() {
  if (OverviewCache && OverviewCache.expire > new Date()) {
    return Promise.resolve(OverviewCache.data);
  }

  const groups = await getInterestGroups();
  OverviewCache = { expire: new Date(Date.now() + 60 * 1000 * 60), data: groups };

  return groups;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <h1 className='text-center text-muted-foreground mt-4'>{(error as { detail: string }).detail}</h1>;
}

export default function InterestGroups({ loaderData }: Route.ComponentProps) {
  const groups = loaderData as Awaited<ReturnType<typeof getInterestGroups>>;
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
              <Link rel='noopener noreferrer' target='_blank' to='https://wiki.tihlde.org'>
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
              </Link>

              <Link rel='noopener noreferrer' target='_blank' to='https://drive.google.com/file/d/1Y4VDE8yUiIwpg5Vow6SBuO6QxnrDzagl/edit'>
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
              </Link>

              <Link rel='noopener noreferrer' target='_blank' to='https://wiki.tihlde.org/soknader-okonomisk#stotte-fra-hs'>
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
              </Link>
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
