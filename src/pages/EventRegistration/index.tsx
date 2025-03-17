import type { CheckedState } from '@radix-ui/react-checkbox';
import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import Page from '~/components/navigation/Page';
import { PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useEventById, useEventRegistrations, useUpdateEventRegistration } from '~/hooks/Event';
import { useDebounce } from '~/hooks/Utils';
import Http404 from '~/pages/Http404';
import type { Registration } from '~/types';
import { PermissionApp } from '~/types/Enums';
import { ListChecks, QrCode } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useEffect, useMemo, useRef, useState } from 'react';
import { href, redirect, useParams } from 'react-router';
import { toast } from 'sonner';

import type { Route } from './+types';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const auth = await authClientWithRedirect(request);
  if (!userHasWritePermission(auth.permissions, PermissionApp.EVENT)) {
    // TODO: Display an unauthorized page
    return redirect(href('/arrangementer'));
  }
}

type QrScanProps = {
  onScan: (userId: string) => Promise<Registration>;
};

const QrScan = ({ onScan }: QrScanProps) => {
  const [scanned, setScanned] = useState<string | undefined>(undefined);
  const val = useDebounce(scanned, 500);
  const [previousScanned, setPreviousScanned] = useState<string | undefined>(undefined);
  const videoTag = useRef<HTMLVideoElement>();
  const qrScanner = useRef<QrScanner | null>(null);

  const onDecode = (result: QrScanner.ScanResult) => setScanned(result.data);

  useEffect(() => {
    if (!val || val === previousScanned) {
      return;
    }
    setPreviousScanned(val);
    onScan(val);
  }, [val, previousScanned]);

  useEffect(() => {
    if (videoTag.current && qrScanner.current === null) {
      qrScanner.current = new QrScanner(videoTag.current, onDecode, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });
      qrScanner.current.start();
    }
    return () => {
      qrScanner.current?.destroy();
    };
  }, []);

  return (
    <video
      className='object-cover aspect-square w-full h-[400px]'
      // @ts-ignore
      ref={videoTag}
    />
  );
};

export type ParticipantCardProps = {
  user: Registration;
  updateAttendedStatus: (username: string, attendedStatus: boolean) => void;
};

const ParticipantCard = ({ user, updateAttendedStatus }: ParticipantCardProps) => {
  const [checkedState, setCheckedState] = useState(user.has_attended);

  const onCheck = async (checked: CheckedState) => {
    setCheckedState(Boolean(checked));
    updateAttendedStatus(user.user_info.user_id, Boolean(checked));
  };

  return (
    <div className='p-4 flex items-center justify-between rounded-md border'>
      <h1>{`${user.user_info.first_name} ${user.user_info.last_name}`}</h1>
      <div className='items-top flex space-x-2'>
        <Checkbox checked={checkedState} id={user.user_info.user_id} onCheckedChange={onCheck} />
        <div className='grid leading-none'>
          <label
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
            htmlFor={user.user_info.user_id}
          >
            Ankommet
          </label>
        </div>
      </div>
    </div>
  );
};

const EventRegistration = () => {
  const { id } = useParams();
  const { data: event, isError } = useEventById(Number(id));
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useEventRegistrations(Number(id), { is_on_wait: false, search: debouncedSearch });
  const updateRegistration = useUpdateEventRegistration(Number(id));
  const registrations = useMemo(() => (data ? data.pages.flatMap((page) => page.results) : []), [data]);

  const updateAttendedStatus = async (userId: string, attendedStatus: boolean) =>
    updateRegistration.mutateAsync(
      { registration: { has_attended: attendedStatus }, userId: userId },
      {
        onSuccess: (registration) => {
          toast.success(
            attendedStatus
              ? `${registration.user_info.first_name} ${registration.user_info.last_name} er registrert ankommet!`
              : `Vi har fjernet ankommet-statusen til ${registration.user_info.first_name} ${registration.user_info.last_name}`,
          );
        },
        onError: (error) => {
          toast.error(error.detail);
        },
      },
    );

  if (isError || (event && !event.sign_up)) {
    return <Http404 />;
  }

  return (
    <Page className='max-w-2xl w-full mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>{event?.title || 'Laster arrangement...'}</CardTitle>
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
                <Label>Søk</Label>
                <Input onChange={(e) => setSearch(e.target.value)} placeholder='Søk etter navn' value={search} />
              </div>
              {!isLoading && !registrations.length && (
                <NotFoundIndicator header={search ? `Ingen påmeldte med navn som inneholder "${search}"` : 'Ingen påmeldte'} />
              )}

              <div className='space-y-2'>
                {registrations.map((registration) => (
                  <ParticipantCard key={registration.registration_id} updateAttendedStatus={updateAttendedStatus} user={registration} />
                ))}
              </div>

              {hasNextPage && <PaginateButton className='w-full mt-4' isLoading={isFetching} nextPage={fetchNextPage} />}
            </TabsContent>
            <TabsContent value='qr'>
              <QrScan onScan={async (userId) => updateAttendedStatus(userId, true)} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Page>
  );
};

export default EventRegistration;
