import { createFileRoute, Link, linkOptions, redirect, useNavigate, useParams } from '@tanstack/react-router';
import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import JobPostEditor from '~/pages/JobPostAdministration/components/JobPostEditor';
import { PermissionApp } from '~/types/Enums';
import { ChevronRight, Plus } from 'lucide-react';

import JobPostList from './components/JobPostList';

export const Route = createFileRoute('/_MainLayout/admin/stillingsannonser/{-$jobPostId}')({
  async beforeLoad({ location }) {
    const auth = await authClientWithRedirect(location.href);

    if (!userHasWritePermission(auth.permissions, PermissionApp.JOBPOST)) {
      throw redirect({ to: '/' });
    }
  },
  component: JobPostAdministration,
});

function JobPostAdministration() {
  const navigate = useNavigate();
  const { jobPostId } = useParams({ strict: false });

  const goToJobPost = (newJobPost: number | null) => {
    if (newJobPost) {
      navigate(linkOptions({ to: '/admin/stillingsannonser/{-$jobPostId}', params: { jobPostId: newJobPost.toString() } }));
    } else {
      navigate(linkOptions({ to: '/admin/stillingsannonser/{-$jobPostId}' }));
    }
  };

  return (
    <Page className='max-w-6xl mx-auto'>
      <div className='space-y-6'>
        <div className='space-y-4 md:space-y-0 md:flex items-center justify-between'>
          <h1 className='font-bold text-4xl md:text-5xl'>{jobPostId ? 'Endre annonse' : 'Ny annonse'}</h1>

          <div className='flex items-center space-x-4'>
            <JobPostList />

            {jobPostId && (
              <>
                <Button asChild size='icon' variant='outline'>
                  <Link to='/admin/stillingsannonser/{-$jobPostId}'>
                    <Plus className='w-5 h-5 stroke-[1.5px]' />
                  </Link>
                </Button>

                <Button asChild className='p-0' variant='link'>
                  <Link to='/stillingsannonser/$id/{-$urlTitle}' params={{ id: jobPostId.toString() }}>
                    Se annonse
                    <ChevronRight className='ml-1 w-5 h-5 stroke-[1.5px]' />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <JobPostEditor goToJobPost={goToJobPost} jobpostId={Number(jobPostId)} />
      </div>
    </Page>
  );
}
