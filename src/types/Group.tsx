import { GroupType, MembershipType } from 'types/Enums';
import { Permissions } from 'types/Misc';
import { UserBase, UserList } from 'types/User';

export type Group = {
  name: string;
  slug: string;
  description: string;
  contact_email: string | null;
  type: GroupType;
  leader: UserBase | UserList | null;
  permissions: Permissions;
  fines_admin: UserBase | UserList | null;
  fines_activated: boolean;
  fine_info: string;
  image: string | null;
  image_alt: string | null;
  viewer_is_member: boolean;
};

export type GroupMutate = Partial<Omit<Group, 'fines_admin' | 'permissions' | 'type' | 'viewer_is_member'>> &
  Pick<Group, 'slug'> & {
    fines_admin?: string | null;
  };

export type GroupList = Pick<Group, 'description' | 'name' | 'slug' | 'type' | 'contact_email' | 'image' | 'image_alt'>;

export type Membership = {
  user: UserBase | UserList;
  membership_type: MembershipType;
  group: Group;
};

export type MembershipHistory = Membership & {
  start_date: string;
  end_date: string;
};

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
  created_by: UserBase;
  created_at: string;
};

export type GroupFineCreate = Pick<GroupFine, 'amount' | 'description' | 'reason'> & {
  user: Array<UserBase['user_id']>;
};

export type GroupFineMutate = Partial<Pick<GroupFine, 'reason' | 'amount' | 'payed' | 'approved'>>;

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
