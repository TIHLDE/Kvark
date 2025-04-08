import type { GroupType, MembershipType } from '~/types/Enums';
import type { Permissions } from '~/types/Misc';
import type { User, UserBase, UserList } from '~/types/User';

export type GroupPermissions = Permissions & {
  group_form: boolean;
};

export type BaseGroup = {
  name: string;
  slug: string;
  type: GroupType;
  image: string | null;
  image_alt: string | null;
  viewer_is_member: boolean;
};

export type GroupList = BaseGroup & {
  contact_email: string | null;
  leader: UserBase | UserList | null;
};

export type Group = GroupList & {
  description: string;
  permissions: GroupPermissions;
  fines_admin: UserBase | UserList | null;
  fines_activated: boolean;
  fine_info: string;
};

export type FormGroupValues = {
  name: string;
  slug: string;
  type: GroupType;
  image?: string;
  image_alt?: string;
  viewer_is_member: boolean;
  contact_email?: string;
  description?: string;
  permissions: GroupPermissions;
  fines_admin: User | null;
  leader: UserList | null;
  fines_activated: boolean;
  fine_info?: string;
};

export type GroupMutate = Partial<Omit<Group, 'fines_admin' | 'permissions' | 'type' | 'viewer_is_member'>> &
  Pick<Group, 'slug'> & {
    fines_admin?: string | null;
  };

export type GroupCreate = {
  name: string;
  slug: string;
  type: GroupType;
};

export type Membership = {
  user: UserBase | UserList;
  membership_type: MembershipType;
  group: BaseGroup;
  created_at: string;
};

export type MembershipWithoutUser = Omit<Membership, 'user'>;

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
  defense: string;
  image: string | null;
  created_by: UserBase;
  created_at: string;
};

export type GroupFineCreate = Pick<GroupFine, 'amount' | 'description' | 'image' | 'reason'> & {
  user: Array<UserBase['user_id']>;
};

export type GroupFineMutate = Partial<Pick<GroupFine, 'reason' | 'amount' | 'image' | 'payed' | 'approved'>>;

export type GroupFineDefenseMutate = Pick<GroupFine, 'defense'>;

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

export type GroupMemberStatistics = {
  studyyears: Array<{ studyyear: Group['name']; amount: number }>;
  studies: Array<{ study: Group['name']; amount: number }>;
};
