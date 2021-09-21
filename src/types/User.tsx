import { PermissionApp, UserClass, UserStudy } from 'types/Enums';
import { Permissions } from 'types/Misc';

export interface LoginRequestResponse {
  token: string;
}

export interface User {
  app_token: string;
  allergy: string;
  cell: number;
  email: string;
  first_name: string;
  gender: number;
  home_busstop?: string;
  image: string;
  last_name: string;
  permissions: Record<PermissionApp, Permissions>;
  tool: string;
  unread_notifications: number;
  user_class: UserClass;
  user_id: string;
  user_study: UserStudy;
  unanswered_evaluations_count: number;
}
export type UserList = Pick<
  User,
  'email' | 'first_name' | 'last_name' | 'user_class' | 'user_id' | 'user_study' | 'allergy' | 'cell' | 'gender' | 'image' | 'tool'
>;
export type UserCreate = Pick<User, 'email' | 'first_name' | 'last_name' | 'user_class' | 'user_id' | 'user_study'> & {
  password: string;
};
