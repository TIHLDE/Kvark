import { MembershipType, GroupType } from 'types/Enums';
import { UserBase } from 'types/User';
import { Permissions } from 'types/Misc';

export interface Group {
  name: string;
  slug: string;
  description: string;
  contact_email: string;
  type: GroupType;
  leader?: UserBase;
  permissions: Permissions;
}

export interface Membership {
  user: UserBase;
  membership_type: MembershipType;
  group: Group;
}
