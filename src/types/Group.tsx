import { MembershipType, GroupType } from 'types/Enums';
import { UserBase } from 'types/User';
import { Permissions } from 'types/Misc';
import { UserList } from 'types/User';

export interface Group {
  name: string;
  slug: string;
  description: string;
  contact_email: string;
  type: GroupType;
  leader: UserBase;
  permissions: Permissions;
}

export type GroupList = Pick<Group, 'leader' | 'name' | 'slug' | 'type'>;

export interface Membership {
  user: UserBase | UserList;
  membership_type: MembershipType;
  group: Group;
}
