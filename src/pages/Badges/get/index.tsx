import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { authClientWithRedirect } from '~/api/auth';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useCreateBadge } from '~/hooks/Badge';

import type { Route } from './+types';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await authClientWithRedirect(request);
}

export default function BadgesGet() {
  const { badgeId } = useParams();
  const [flag, setFlag] = useState<string>(badgeId ? badgeId : '');
  const createUserBadge = useCreateBadge();

  const submit = useCallback(() => {
    const formatedId = flag.replace(/flag{/gi, '').replace(/}/gi, '');
    createUserBadge.mutate(formatedId, {
      onSuccess: () => {
        toast.success('Badge ervervet');
        setFlag('');
      },
      onError: (e) => {
        toast.error(e.detail || 'Noe gikk galt');
      },
    });
  }, [createUserBadge, flag]);

  useEffect(() => {
    if (badgeId) {
      submit();
    }
  }, [badgeId, submit]);

  return (
    <div className='mt-4 flex items-center space-x-4'>
      <Input className='w-full' onChange={(event) => setFlag(event.target.value)} placeholder='flag{xxx-xxx-xxx-xxx-xxx}' value={flag} />
      <Button onClick={submit} size='sm'>
        Send inn
      </Button>
    </div>
  );
}
