import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import AppleAppStoreBadge from '~/assets/img/apple-appstore-badge.svg';
import GooglePlayBadge from '~/assets/img/google-play-badge.svg';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { ExternalLink } from '~/components/ui/external-link';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { getEventByIdQuery, getEventRegistrationsQuery } from '~/api/queries/events';
import URLS from '~/URLS';
import { ListChecks, QrCode } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { useScanner } from './components/useScanner';

// TODO: Re-add auth protection — previously used authClientWithRedirect() / userHasWritePermission(PermissionApp.EVENT)

export const Route = createFileRoute('/_MainLayout/arrangementer/registrering/$id')({
  component: EventRegistration,
});

type QrScanProps = {
  onScan: (userId: string) => void;
};

function QrScan({ onScan }: QrScanProps) {
  const [scanned, setScanned] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (scanned) {
      onScan(scanned);
    }
  }, [scanned]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useScanner(videoRef, {
    onResult(result) {
      setScanned(result.data);
    },
    onError() {
      setScanned(undefined);
    },
    maxScansPerSecond: 3,
  });

  return <video className='object-cover aspect-square w-full h-[400px]' ref={videoRef} />;
}

type ParticipantCardProps = {
  user: { id: string; name: string };
  onToggleAttended: (userId: string, attended: boolean) => void;
};

function ParticipantCard({ user, onToggleAttended }: ParticipantCardProps) {
  const [checkedState, setCheckedState] = useState(false);

  const onCheck = (checked: CheckedState) => {
    setCheckedState(Boolean(checked));
    onToggleAttended(user.id, Boolean(checked));
  };

  return (
    <div className='p-4 flex items-center justify-between rounded-md border'>
      <h1>{user.name}</h1>
      <div className='items-top flex space-x-2'>
        <Checkbox checked={checkedState} id={user.id} onCheckedChange={onCheck} />
        <div className='grid leading-none'>
          <label
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
            htmlFor={user.id}>
            Ankommet
          </label>
        </div>
      </div>
    </div>
  );
}

function EventRegistration() {
  const { id } = Route.useParams();
  const { data: event } = useSuspenseQuery(getEventByIdQuery(id));
  const [search, setSearch] = useState('');

  const { data: registrationsData, isLoading } = useQuery(getEventRegistrationsQuery(id, 0));

  // Filter client-side since the API does not support search
  const filteredUsers = useMemo(() => {
    if (!registrationsData) return [];
    const lowerSearch = search.toLowerCase();
    return registrationsData.registeredUsers.filter(
      (user) => !search || user.name.toLowerCase().includes(lowerSearch),
    );
  }, [registrationsData, search]);

  // TODO: Re-add updateEventRegistration — the new API does not have a PATCH/PUT for individual registrations yet
  const updateAttendedStatus = (_userId: string, attendedStatus: boolean) => {
    toast.info(
      attendedStatus
        ? 'Registrering av ankomst er ikke implementert enna'
        : 'Fjerning av ankomst-status er ikke implementert enna',
    );
  };

  return (
    <Page className='max-w-2xl w-full mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Tabs defaultValue='registrations'>
            <TabsList>
              <TabsTrigger value='registrations'>
                <ListChecks className='w-5 h-5 mr-2 stroke-[1.5px]' />
                Navn
              </TabsTrigger>
              <TabsTrigger value='qr'>
                <QrCode className='w-5 h-5 mr-2 stroke-[1.5px]' />
                QR-skanner
              </TabsTrigger>
            </TabsList>
            <TabsContent className='space-y-4' value='registrations'>
              <div>
                <Label>Sok</Label>
                <Input onChange={(e) => setSearch(e.target.value)} placeholder='Sok etter navn' value={search} />
              </div>
              {!isLoading && filteredUsers.length === 0 && (
                <NotFoundIndicator header={search ? `Ingen pameldte med navn som inneholder "${search}"` : 'Ingen pameldte'} />
              )}

              <div className='space-y-2'>
                {filteredUsers.map((user) => (
                  <ParticipantCard
                    key={user.id}
                    onToggleAttended={updateAttendedStatus}
                    user={user}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value='qr'>
              <div>
                <div className='flex flex-col items-center space-y-4 mb-4'>
                  <p className='text-muted-foreground text-center'>
                    Vi kommer til a fjerne QR-Scanneren fra nettsiden i fremtiden. Du finner en bedre QR-Scanner i{' '}
                    <strong className='text-foreground'>TIHLDE appen</strong>. Bytt over for en bedre opplevelse!
                  </p>
                  <div>
                    <ExternalLink href={URLS.external.mobileApp.iOS}>
                      <img src={AppleAppStoreBadge} alt='Last ned iPhone-appen' className='inline-block w-auto h-12' />
                    </ExternalLink>{' '}
                    <ExternalLink href={URLS.external.mobileApp.Android}>
                      <img src={GooglePlayBadge} alt='Last ned Android-appen' className='inline-block w-auto h-12' />
                    </ExternalLink>
                  </div>
                </div>
                <QrScan onScan={(userId) => updateAttendedStatus(userId, true)} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Page>
  );
}
