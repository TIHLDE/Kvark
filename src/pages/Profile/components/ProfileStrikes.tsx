import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import StrikeListItem from '~/components/miscellaneous/StrikeListItem';
import { Card, CardContent } from '~/components/ui/card';
import { ExternalLink } from '~/components/ui/external-link';
import { useUser, useUserStrikes } from '~/hooks/User';
import URLS from '~/URLS';

function ProfileStrikes() {
  const { data = [] } = useUserStrikes();
  const { data: user } = useUser();
  return (
    <div className='space-y-2'>
      <Card className='rounded-md'>
        <CardContent className='py-4'>
          <h1>
            Informasjon om prikksystemet finner du i <ExternalLink href={URLS.external.wiki.EVENT_RULES}>arrangementsreglene</ExternalLink>.{' '}
            {Boolean(data.length) && <span>Uenig i en prikk? Ta kontakt med ansvarlig for arrangementet.</span>}
          </h1>
        </CardContent>
      </Card>
      {data.length ? (
        user && data.map((strike) => <StrikeListItem key={strike.id} strike={strike} user={user} />)
      ) : (
        <NotFoundIndicator header='Fant ingen prikker' subtitle='Du har ingen prikker!' />
      )}
    </div>
  );
}

export default ProfileStrikes;
