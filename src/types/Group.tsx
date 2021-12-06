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
  leader: UserBase | UserList | null;
  permissions: Permissions;
  fines_admin: UserBase | UserList | null;
  fines_activated: boolean;
  fine_info: string;
  image: string | null;
  image_alt: string | null;
};

export type GroupMutate = Partial<Omit<Group, 'fines_admin' | 'permissions' | 'type'>> &
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

export type Law = {
  id: string;
  description: string;
  paragraph: string;
  amount: number;
};

export type LawMutate = Omit<Law, 'id'>;
