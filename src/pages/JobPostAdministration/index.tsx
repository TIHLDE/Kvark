import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import JobPostEditor from '~/pages/JobPostAdministration/components/JobPostEditor';
import URLS from '~/URLS';
import { ChevronRight, Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';

import JobPostList from './components/JobPostList';

const JobPostAdministration = () => {
  const navigate = useNavigate();
  const { jobPostId } = useParams();

  const goToJobPost = (newJobPost: number | null) => {
    if (newJobPost) {
      navigate(`${URLS.jobpostsAdmin}${newJobPost}/`);
    } else {
      navigate(URLS.jobpostsAdmin);
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
                  <Link to={URLS.jobpostsAdmin}>
                    <Plus className='w-5 h-5 stroke-[1.5px]' />
                  </Link>
                </Button>

                <Button asChild className='p-0' variant='link'>
                  <Link to={`${URLS.jobposts}${jobPostId}/`}>
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
};

export default JobPostAdministration;
