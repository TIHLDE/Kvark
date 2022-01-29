import { PermissionApp, UserClass, UserStudy } from 'types/Enums';
import { Permissions } from 'types/Misc';

export type LoginRequestResponse = {
  token: string;
};

export type User = {
  allergy: string;
  cell: number;
  email: string;
  first_name: string;
  gender: number;
  image: string;
  last_name: string;
  permissions: Record<PermissionApp, Permissions>;
  tool: string;
  unread_notifications: number;
  user_class: UserClass;
  user_id: string;
  user_study: UserStudy;
  unanswered_evaluations_count: number;
  number_of_strikes: number;
};

export type UserBase = Pick<User, 'user_id' | 'first_name' | 'last_name' | 'image' | 'email' | 'user_class' | 'user_study' | 'gender'>;
export type UserList = UserBase & Pick<User, 'email' | 'user_class' | 'user_study' | 'allergy' | 'cell' | 'gender' | 'tool' | 'number_of_strikes'>;
export type UserCreate = Pick<User, 'email' | 'first_name' | 'last_name' | 'user_class' | 'user_id' | 'user_study'> & {
  password: string;
};
