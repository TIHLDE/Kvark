import { GroupType, MembershipType } from 'types/Enums';
import { Permissions } from 'types/Misc';
import { UserBase, UserList } from 'types/User';

export type GroupPermissions = Permissions & {
  group_form: boolean;
};

export type Group = {
  name: string;
  slug: string;
  description: string;
  contact_email: string | null;
  type: GroupType;
  leader: UserBase | UserList | null;
  permissions: GroupPermissions;
  fines_admin: UserBase | UserList | null;
  fines_activated: boolean;
  fine_info: string;
  image: string | null;
  image_alt: string | null;
  viewer_is_member: boolean;
};

export type GroupList = Pick<Group, 'name' | 'slug' | 'type' | 'viewer_is_member' | 'image' | 'image_alt'>;

export type GroupMutate = Partial<Omit<Group, 'fines_admin' | 'permissions' | 'type' | 'viewer_is_member'>> &
  Pick<Group, 'slug'> & {
    fines_admin?: string | null;
  };

export type Membership = {
  user: UserBase | UserList;
  membership_type: MembershipType;
  group: GroupList;
  created_at: string;
};

export type MembershipHistory = Pick<Membership, 'group' | 'user' | 'membership_type'> & {
  id: string;
  start_date: string;
  end_date: string;
};

export type MembershipHistoryMutate = Pick<MembershipHistory, 'end_date' | 'start_date' | 'membership_type'>;

export type GroupLaw = {
  id: string;
  description: string;
  paragraph: number;
  title: string;
  amount: number;
};

export type GroupLawMutate = Omit<GroupLaw, 'id'>;

export type GroupFine = {
  id: string;
  user: UserBase;
  amount: number;
  approved: boolean;
  payed: boolean;
  description: string;
  reason: string;
  image: string | null;
  created_by: UserBase;
  created_at: string;
};

export type GroupFineCreate = Pick<GroupFine, 'amount' | 'description' | 'image' | 'reason'> & {
  user: Array<UserBase['user_id']>;
};

export type GroupFineMutate = Partial<Pick<GroupFine, 'reason' | 'amount' | 'image' | 'payed' | 'approved'>>;

export type GroupFineBatchMutate = {
  fine_ids: Array<GroupFine['id']>;
  data: GroupFineMutate;
};

export type GroupUserFine = {
  user: UserBase;
  fines_amount: number;
};

export type GroupFineStatistics = {
  payed: number;
  approved_and_not_payed: number;
  not_approved: number;
};
