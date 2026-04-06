import { createFileRoute, useParams } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import Page from '~/components/navigation/Page';
import { getNewsByIdQuery } from '~/api/queries/news';
import NewsRenderer from './components/NewsRenderer';

export const Route = createFileRoute('/_MainLayout/nyheter/$id/{-$urlTitle}')({
  component: NewsDetails,
});

function NewsDetails() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(getNewsByIdQuery(String(id)));

  return (
    <Page>
      <div className='pb-4'>
        <NewsRenderer data={data} />
      </div>
    </Page>
  );
}
