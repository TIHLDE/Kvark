import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useUserMemberships } from 'hooks/User';

import { ShortCutMenuProps } from '.';
import LoadingSpinnner from '../LoadingSpinner';
import ShortCutLink from './Item';
import ShortCutSectionWrapper from './SectionWrapper';

const ShortCutMembership = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const { userId } = useParams();
  const { data, isLoading } = useUserMemberships(userId);
  const memberships = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <ShortCutSectionWrapper title='Mine Medlemskap'>
      {isLoading && <LoadingSpinnner />}
      {!isLoading && memberships.length === 0 && <p className='text-sm'>Du er ikke medlem av noen grupper.</p>}
      {memberships.map((membership, index) => (
        <ShortCutLink key={index} path={`/grupper/${membership.group.slug}`} setOpen={setOpen} title={membership.group.name} />
      ))}
    </ShortCutSectionWrapper>
  );
};

export default ShortCutMembership;
