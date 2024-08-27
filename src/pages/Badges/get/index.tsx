import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useCreateBadge } from 'hooks/Badge';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

const BadgesGet = () => {
  const { badgeId } = useParams();
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
};

export default BadgesGet;
