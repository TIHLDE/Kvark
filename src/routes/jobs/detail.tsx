import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { getJobByIdQuery } from '~/api/queries/jobs';
import JobPostRenderer from '~/routes/jobs/-components/JobPostRenderer';

export const Route = createFileRoute('/_MainLayout/stillingsannonser/$id/{-$urlTitle}')({
  component: JobPostDetails,
});

function JobPostDetails() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(getJobByIdQuery(id));

  return (
    <Page>
      <JobPostRenderer data={data} />
    </Page>
  );
}
