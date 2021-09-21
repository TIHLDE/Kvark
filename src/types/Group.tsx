import { MembershipType, GroupType } from 'types/Enums';
import { UserList } from 'types/User';
import { Permissions } from 'types/Misc';

export interface Group {
  name: string;
  slug: string;
  description: string;
  contact_email: string;
  type: GroupType;
  leader: UserList;
  permissions: Permissions;
}

export type GroupList = Pick<Group, 'leader' | 'name' | 'slug' | 'type'>;

export interface Membership {
  user: UserList;
  membership_type: MembershipType;
  group: Group;
}
