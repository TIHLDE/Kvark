import { createFileRoute } from '@tanstack/react-router';
import { authClientWithRedirect } from '~/api/auth';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useCreateBadge } from '~/hooks/Badge';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_MainLayout/badges/_layout/erverv/{-$badgeId}')({
  async beforeLoad({ location }) {
    await authClientWithRedirect(location.href);
  },
  component: BadgesGet,
});

export default function BadgesGet() {
  const { badgeId } = Route.useParams();
  const [flag, setFlag] = useState<string>(badgeId ? badgeId : '');
  const createUserBadge = useCreateBadge();

  const submit = () => {
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
  };

  useEffect(() => {
    if (badgeId) {
      submit();
    }
  }, [badgeId]);

  return (
    <div className='mt-4 flex items-center space-x-4'>
      <Input className='w-full' onChange={(event) => setFlag(event.target.value)} placeholder='flag{xxx-xxx-xxx-xxx-xxx}' value={flag} />
      <Button onClick={submit} size='sm'>
        Send inn
      </Button>
    </div>
  );
}
