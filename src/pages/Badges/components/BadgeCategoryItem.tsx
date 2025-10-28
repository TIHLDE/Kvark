import { Link } from '@tanstack/react-router';
import AspectRatioImg from '~/components/miscellaneous/AspectRatioImg';
import type { BadgeCategory } from '~/types';

export type BadgeItemProps = {
  badgeCategory: BadgeCategory;
};

const BadgeCategoryItem = ({ badgeCategory }: BadgeItemProps) => (
  <Link
    className='px-4 py-2 rounded-md border bg-card flex items-center space-x-2 hover:bg-border transition-all duration-150'
    params={{ categoryId: badgeCategory.id }}
    to='/badges/kategorier/$categoryId'>
    <AspectRatioImg alt={badgeCategory.name} className='w-[100px] rounded-md' src={badgeCategory.image || ''} />
    <div>
      <h1 className='text-lg font-semibold text-black dark:text-white'>{badgeCategory.name}</h1>
      <p className='text-sm text-muted-foreground'>{badgeCategory.description}</p>
    </div>
  </Link>
);

export default BadgeCategoryItem;
