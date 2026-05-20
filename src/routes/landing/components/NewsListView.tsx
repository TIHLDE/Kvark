import NewsListItem, { NewsListItemLoading } from '~/components/miscellaneous/NewsListItem';
import { useQuery } from '@tanstack/react-query';
import { getNewsQuery } from '~/api/queries/news';
import type { News } from '~/types';

const NO_OF_NEWS_TO_SHOW = 2;

// TODO: Remove this adapter once NewsListItem is migrated to new API types
function toOldNewsType(item: {
  id: string;
  title: string;
  header: string;
  body: string;
  imageUrl: string | null;
  imageAlt: string | null;
  createdAt: string;
  updatedAt: string;
}): News {
  return {
    id: Number(item.id) || 0,
    title: item.title,
    header: item.header,
    body: item.body,
    image: item.imageUrl ?? undefined,
    image_alt: item.imageAlt ?? undefined,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    creator: null,
    emojis_allowed: false,
    reactions: [],
  };
}

const NewsListView = () => {
  const { data, isLoading } = useQuery(getNewsQuery(0));
  const news = (data?.items ?? []).map(toOldNewsType);

  if (isLoading) {
    return <NewsListItemLoading />;
  } else if (news.length) {
    return (
      <div className='grid md:grid-cols-2 gap-4'>
        {news.slice(0, NO_OF_NEWS_TO_SHOW).map((newsItem, index) => (
          <NewsListItem key={index} news={newsItem} />
        ))}
      </div>
    );
  } else {
    return <h1 className='text-center '>Fant ingen nyheter</h1>;
  }
};

export default NewsListView;
