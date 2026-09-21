import type { Group, GroupFine, GroupLaw, Membership, User } from '~/types';
import { GroupType, MembershipType } from '~/types/Enums';

const studyMembership = (groupName: string, groupSlug: string) => ({
  membership_type: MembershipType.MEMBER,
  group: { name: groupName, slug: groupSlug, type: GroupType.STUDY, image: null, image_alt: null, viewer_is_member: true },
  created_at: '2023-08-01T10:00:00.000Z',
});

const baseUser: User = {
  user_id: 'index',
  first_name: 'Bortherman',
  last_name: 'Testern',
  email: 'index@tihlde.org',
  image: '',
  gender: 1,
  tool: 'Mac',
  allergy: 'Ingen',
  unread_notifications: 0,
  number_of_strikes: 0,
  unanswered_evaluations_count: 0,
  public_event_registrations: true,
  accepts_event_rules: true,
  allows_photo_by_default: true,
  slack_user_id: 'U123',
  study: studyMembership('Dataingeniør', 'dataingenior'),
  studyyear: studyMembership('2023', '2023'),
  bio: { id: 1, description: 'Mock-bruker' } as User['bio'],
};

const makeUser = (userId: string, firstName: string, lastName: string): User => ({
  ...baseUser,
  user_id: userId,
  first_name: firstName,
  last_name: lastName,
  email: `${userId}@tihlde.org`,
  study: { ...baseUser.study, group: { ...baseUser.study.group } },
  studyyear: { ...baseUser.studyyear, group: { ...baseUser.studyyear.group } },
  bio: { ...baseUser.bio },
});

export const users: User[] = [makeUser('index', 'Bortherman', 'Testern'), makeUser('kari_n', 'Kari', 'Nordmann'), makeUser('per_h', 'Per', 'Hansen')];

export const userBase = (userId: string) => {
  const user = users.find((u) => u.user_id === userId) || users[0];
  return {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    image: user.image,
    email: user.email,
    gender: user.gender,
    study: user.study,
    studyyear: user.studyyear,
  };
};

export const group = (slug: string): Group => ({
  name: 'Kvark',
  slug,
  type: GroupType.BOARD,
  image: null,
  image_alt: null,
  viewer_is_member: true,
  contact_email: 'kvark@tihlde.org',
  leader: userBase('index'),
  description: 'Mock-gruppe for å se på bøter.',
  permissions: { write: true, read: true, write_all: true, destroy: true, group_form: true },
  fines_admin: userBase('index'),
  fines_activated: true,
  fine_info: 'Boter betales til kassen i kontoret.',
});

export const memberships: Membership[] = users.map((user) => ({
  user: userBase(user.user_id),
  membership_type: user.user_id === 'index' ? MembershipType.LEADER : MembershipType.MEMBER,
  group: { name: 'Kvark', slug: 'kvark', type: GroupType.BOARD, image: null, image_alt: null, viewer_is_member: true },
  created_at: '2024-01-01T10:00:00.000Z',
}));

export const laws: GroupLaw[] = [
  { id: 'law-1', description: 'Kom for sent på møte', paragraph: 1, title: 'For sent', amount: 50 },
  { id: 'law-2', description: 'Glemte kakeansvar', paragraph: 2, title: 'Kakeansvar', amount: 100 },
  { id: 'law-3', description: 'Bordnetverk ikke oppsatt', paragraph: 3, title: 'Teknisk', amount: 200 },
];

let nextFineId = 1;

export const finesStore: GroupFine[] = [
  {
    id: 'fine-1',
    user: userBase('index'),
    amount: 50,
    approved: true,
    payed: false,
    description: 'Kom 20 min for sent på styremøte',
    reason: 'Bussen ble borte. **Ikke** hans feil egentlig.',
    defense: '',
    image: null,
    created_by: userBase('kari_n'),
    created_at: '2025-11-20T17:30:00.000Z',
  },
  {
    id: 'fine-2',
    user: userBase('kari_n'),
    amount: 100,
    approved: true,
    payed: true,
    description: 'Glemte kakeansvar',
    reason: 'Kaken var i hvert fall god da den endelig kom.',
    defense: '',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    created_by: userBase('index'),
    created_at: '2025-11-18T12:00:00.000Z',
  },
  {
    id: 'fine-3',
    user: userBase('per_h'),
    amount: 200,
    approved: false,
    payed: false,
    description: 'Bordnetverk var nede hele fadderuka',
    reason: 'Routeren ble plugges ut under fest.',
    defense: 'Jeg mener dette var en sabotasjehandling og bør behandles som sådan.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    created_by: userBase('index'),
    created_at: '2025-11-15T09:00:00.000Z',
  },
];

export type FineCreateData = Pick<GroupFine, 'amount' | 'description' | 'image' | 'reason'> & { user: string[] };

export const createFines = (data: FineCreateData): GroupFine[] =>
  data.user.map((userId) => ({
    id: `fine-${nextFineId++}`,
    user: userBase(userId),
    amount: data.amount,
    approved: false,
    payed: false,
    description: data.description,
    reason: data.reason || '',
    defense: '',
    image: data.image,
    created_by: userBase('index'),
    created_at: new Date().toISOString(),
  }));
