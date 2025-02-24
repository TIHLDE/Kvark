import TIHLDE_LOGO from '~/assets/img/TihldeBackground.jpg';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { ReactionHandler } from '~/components/miscellaneous/reactions/ReactionHandler';
import ShareButton from '~/components/miscellaneous/ShareButton';
import UpdatedAgo from '~/components/miscellaneous/UpdatedAgo';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { HavePermission, useUser } from '~/hooks/User';
import type { News } from '~/types';
import { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { formatDate } from '~/utils';
import { parseISO } from 'date-fns';
import { PencilIcon } from 'lucide-react';
import { Link } from 'react-router';

export type NewsRendererProps = {
  data: News;
  preview?: boolean;
};

const NewsRenderer = ({ data, preview = false }: NewsRendererProps) => {
  const { data: user } = useUser();

  return (
    <div>
      <div className='px-4 mx-auto max-w-4xl w-full pb-10'>
        <div className='space-y-2'>
          <h1 className='text-2xl break-words lg:text-4xl font-semibold'>{data.title}</h1>
          <h1 className='break-words lg:text-lg'>{data.header}</h1>
        </div>
        <Separator className='my-6 bg-secondary-foreground dark:bg-border' />
        <div className='space-y-2'>
          {data.creator && (
            <h1>
              Skrevet av{' '}
              <Link className='underline' to={`${URLS.profile}${data.creator.user_id}/`}>
                {data.creator.first_name} {data.creator.last_name}
              </Link>
            </h1>
          )}
          <h1 className='text-sm text-muted-foreground'>{formatDate(parseISO(data.created_at), { time: false })}</h1>
          {data.updated_at && <UpdatedAgo updatedAt={data.updated_at} />}
        </div>
      </div>

      <div className='px-4 mx-auto max-w-4xl w-full space-y-4 lg:space-y-8'>
        <img alt={data.image_alt || data.title} className='rounded-md aspect-auto mx-auto' src={data.image || TIHLDE_LOGO} />

        <div className='space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between'>
          <div className='flex items-center space-x-2'>
            <ShareButton shareId={data.id} shareType='news' title={data.title} />
            {!preview && (
              <HavePermission apps={[PermissionApp.NEWS]}>
                <Button className='w-full flex items-center space-x-2' size='lg' variant='outline'>
                  <PencilIcon className='w-4 h-4 md:w-5 md:h-5 stroke-[1.5px]' />
                  <Link className='text-sm md:text-md' to={`${URLS.newsAdmin}${data.id}/`}>
                    Endre nyhet
                  </Link>
                </Button>
              </HavePermission>
            )}
          </div>
          {!preview && data?.emojis_allowed && user && <ReactionHandler content_type='news' data={data} />}
        </div>

        <Separator className='bg-secondary-foreground dark:bg-border' />

        <div>
          <MarkdownRenderer value={data.body} />
        </div>
      </div>
    </div>
  );
};

export default NewsRenderer;

export const NewsRendererLoading = () => (
  <div className='space-y-4'>
    <Skeleton className='h-60' />
    <Skeleton className='h-96' />
  </div>
);
