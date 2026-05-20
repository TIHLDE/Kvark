import type { EventList } from '~/types';
import type { BaseGroup } from '~/types/Group';
import type { GroupType } from '~/types/Enums';

export type ApiEventListItem = {
  id: string;
  slug: string;
  title: string;
  location?: string | null;
  startTime: string;
  endTime: string;
  organizer: { name: string; slug: string; type: string } | null;
  closed: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  category: { slug: string; label: string };
};

/**
 * Adapts the new API EventListItem to the old EventList type expected by shared components.
 * TODO: Remove this adapter once EventListItem component is migrated to new API types.
 */
export function toOldEventListType(item: ApiEventListItem): EventList {
  return {
    id: Number(item.id) || 0,
    title: item.title,
    location: item.location ?? '',
    start_date: item.startTime,
    end_date: item.endTime,
    updated_at: item.updatedAt,
    expired: false,
    image: item.image ?? undefined,
    image_alt: item.title,
    organizer: item.organizer
      ? ({
          name: item.organizer.name,
          slug: item.organizer.slug,
          type: item.organizer.type as GroupType,
          image: null,
          image_alt: null,
          viewer_is_member: false,
        } satisfies BaseGroup)
      : null,
    category: { id: 0, text: item.category.label },
  };
}
