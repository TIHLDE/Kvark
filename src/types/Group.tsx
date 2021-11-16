import { MembershipType, GroupType } from 'types/Enums';
import { UserBase } from 'types/User';
import { Permissions } from 'types/Misc';
import { UserList } from 'types/User';

export type Group = {
  name: string;
  slug: string;
  description: string;
  contact_email: string | null;
  type: GroupType;
  leader?: UserBase | UserList;;
  permissions: Permissions;
};

export type GroupList = Pick<Group, 'leader' | 'name' | 'slug' | 'type'>;

export type Membership = {
  user: UserBase | UserList;
  membership_type: MembershipType;
  group: Group;
};

export type MembershipHistory = Membership & {
  start_date: string;
  end_date: string;
};
