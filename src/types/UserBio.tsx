export type UserBio = {
  id: number;
  description?: string;
  gitHub_link?: string;
  linkedIn_link?: string;
};

export type UserBioCreate = Pick<UserBio, 'linkedIn_link' | 'description' | 'gitHub_link'>;
