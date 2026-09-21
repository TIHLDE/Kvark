import { HttpResponse, http } from 'msw';
import { TIHLDE_API_URL } from '~/constant';
import type { DefaultBodyType, PathParams, RequestHandler } from 'msw';
import type {
  GroupFine,
  GroupFineStatistics,
  GroupList,
  GroupUserFine,
  LoginRequestResponse,
  Membership,
  PaginationResponse,
  RequestResponse,
  User,
  UserPermissions,
} from '~/types';
import { PermissionApp } from '~/types/Enums';
import { createFines, finesStore, group, laws, memberships, users } from './data';
import * as fx from './fixtures';

// SIMPLIFIED: single fixed page of 25 results per list endpoint (no real pagination cursor),
// `next` is always null. If huge datasets are ever needed, slice by the `page` query param.

// Anchor handlers to the API origin, NOT `*/` wildcards: `*` matches across slashes,
// so `*/pages/:path` would swallow Vite's own `/src/pages/*.tsx` module requests.
const API = new URL(TIHLDE_API_URL).origin;

const paginate = <T>(results: T[]): PaginationResponse<T> => ({ count: results.length, next: null, previous: null, results });

const json = (data: DefaultBodyType, status = 200) => HttpResponse.json(data, { status });

const permissions: UserPermissions['permissions'] = Object.fromEntries(
  Object.values(PermissionApp).map((app) => [app, { write: true, read: true, write_all: true, destroy: true }]),
) as UserPermissions['permissions'];

const statistics = (): GroupFineStatistics => ({
  payed: finesStore.filter((fine) => fine.payed && fine.approved).reduce((sum, fine) => sum + fine.amount, 0),
  approved_and_not_payed: finesStore.filter((fine) => !fine.payed && fine.approved).reduce((sum, fine) => sum + fine.amount, 0),
  not_approved: finesStore.filter((fine) => !fine.approved).reduce((sum, fine) => sum + fine.amount, 0),
});

const filterFines = (url: URL, fines: GroupFine[]) => {
  const approved = url.searchParams.get('approved');
  const payed = url.searchParams.get('payed');
  return fines
    .filter((fine) => (approved === null ? true : fine.approved === (approved === 'true')))
    .filter((fine) => (payed === null ? true : fine.payed === (payed === 'true')));
};

export const handlers: Array<RequestHandler> = [
  // Auth
  http.post(`${API}/auth/login/`, async ({ request }) => {
    const { user_id, password } = (await request.json()) as { user_id: string; password: string };
    if (user_id === 'index' && password === 'index123') {
      return json({ token: 'mock-token' } satisfies LoginRequestResponse);
    }
    return json({ detail: 'Feil brukernavn eller passord' }, 400);
  }),
  http.post(`${API}/auth/rest-auth/password/reset/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.post(`${API}/users/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.post(`${API}/feide/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Groups
  http.get(`${API}/groups/`, () => json([group('kvark')] satisfies GroupList[])),
  http.get(`${API}/groups/:slug/`, ({ params }: { params: PathParams }) => json(group(String(params.slug)))),
  http.get(`${API}/groups/:slug/memberships/`, () => json(paginate(memberships) as PaginationResponse<Membership>)),
  http.get(`${API}/groups/:slug/laws/`, () => json(laws)),

  // Group fines (statistics/users/batch-update must be registered before :fineId)
  http.get(`${API}/groups/:slug/fines/statistics/`, () => json(statistics())),
  http.get(`${API}/groups/:slug/fines/users/`, ({ request }) => {
    const url = new URL(request.url);
    const userFines: GroupUserFine[] = users.map((user) => ({
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        image: user.image,
        email: user.email,
        gender: user.gender,
        study: user.study,
        studyyear: user.studyyear,
      },
      fines_amount: filterFines(
        url,
        finesStore.filter((fine) => fine.user.user_id === user.user_id),
      ).reduce((sum, fine) => sum + fine.amount, 0),
    }));
    return json(paginate(userFines) as PaginationResponse<GroupUserFine>);
  }),
  http.get(`${API}/groups/:slug/fines/users/:userId/`, ({ request, params }) => {
    const url = new URL(request.url);
    const userFines = filterFines(
      url,
      finesStore.filter((fine) => fine.user.user_id === String(params.userId)),
    );
    return json(paginate(userFines) as PaginationResponse<GroupFine>);
  }),
  http.put(`${API}/groups/:slug/fines/batch-update/:userId/`, async ({ request, params }) => {
    const data = (await request.json()) as { approved?: boolean; payed?: boolean };
    finesStore.filter((fine) => fine.user.user_id === String(params.userId)).forEach((fine) => Object.assign(fine, data));
    return json({ detail: 'OK' } satisfies RequestResponse);
  }),
  http.put(`${API}/groups/:slug/fines/batch-update/`, async ({ request }) => {
    const parsed = (await request.json()) as { fine_ids: string[]; data: { approved?: boolean; payed?: boolean } };
    finesStore.filter((fine) => parsed.fine_ids.includes(fine.id)).forEach((fine) => Object.assign(fine, parsed.data));
    return json({ detail: 'OK' } satisfies RequestResponse);
  }),
  http.get(`${API}/groups/:slug/fines/`, ({ request }) => {
    const url = new URL(request.url);
    return json(paginate(filterFines(url, finesStore)) as PaginationResponse<GroupFine>);
  }),
  http.post(`${API}/groups/:slug/fines/`, async ({ request }) => {
    const data = (await request.json()) as Parameters<typeof createFines>[0];
    const created = createFines(data);
    finesStore.push(...created);
    return json(created[0]);
  }),
  http.put(`${API}/groups/:slug/fines/:fineId/defense/`, async ({ request, params }) => {
    const { defense } = (await request.json()) as { defense: string };
    const fine = finesStore.find((f) => f.id === String(params.fineId));
    if (fine) fine.defense = defense;
    return json(fine);
  }),
  http.put(`${API}/groups/:slug/fines/:fineId/`, async ({ request, params }) => {
    const data = (await request.json()) as Partial<Pick<GroupFine, 'approved' | 'payed' | 'amount' | 'description' | 'reason'>>;
    const fine = finesStore.find((f) => f.id === String(params.fineId));
    if (fine) Object.assign(fine, data);
    return json(fine);
  }),
  http.delete(`${API}/groups/:slug/fines/:fineId/`, ({ params }) => {
    const index = finesStore.findIndex((f) => f.id === String(params.fineId));
    if (index !== -1) finesStore.splice(index, 1);
    return json({ detail: 'OK' } satisfies RequestResponse);
  }),

  // --- Everything below is static fixtures: GETs return canned data, mutations echo back ---

  // Banners
  http.get(`${API}/banners/visible`, () => json([fx.banner])),
  http.get(`${API}/banners/`, () => json(paginate([fx.banner]))),
  http.get(`${API}/banners/:id/`, () => json(fx.banner)),
  http.post(`${API}/banners/`, () => json(fx.banner)),
  http.put(`${API}/banners/:id/`, () => json(fx.banner)),
  http.delete(`${API}/banners/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Events (specific paths before :id)
  http.get(`${API}/events/admin/`, () => json(paginate(fx.eventList))),
  http.get(`${API}/events/:id/statistics/`, () => json(fx.eventStatistics)),
  http.get(`${API}/events/:id/public_registrations/`, () => json(paginate([{ user_info: fx.registration.user_info }]))),
  http.get(`${API}/events/:id/favorite/`, () => json(fx.eventFavorite)),
  http.put(`${API}/events/:id/favorite/`, () => json(fx.eventFavorite)),
  http.post(`${API}/events/:id/notify/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.post(`${API}/events/:id/mail-gift-cards/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/events/:id/registrations/add/`, () => json(fx.registration)),
  http.post(`${API}/events/:id/registrations/add/`, () => json(fx.registration)),
  http.get(`${API}/events/:id/registrations/:userId/`, () => json(fx.registration)),
  http.get(`${API}/events/:id/registrations/`, () => json(paginate([fx.registration]))),
  http.post(`${API}/events/:id/registrations/`, () => json(fx.registration)),
  http.put(`${API}/events/:id/registrations/:userId/`, () => json(fx.registration)),
  http.delete(`${API}/events/:id/registrations/:userId/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/events/`, () => json(paginate(fx.eventList))),
  http.get(`${API}/events/:id/`, () => json(fx.event)),
  http.post(`${API}/events/`, () => json(fx.event)),
  http.put(`${API}/events/:id/`, () => json(fx.event)),
  http.delete(`${API}/events/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Payment
  http.get(`${API}/payment/order`, () => json(fx.order)),
  http.post(`${API}/payments/`, () => json(fx.order)),

  // Forms (delete-all and submissions before :id)
  http.delete(`${API}/forms/:id/submissions/delete-all/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/forms/:id/submissions/`, () => json(paginate([fx.userSubmission]))),
  http.post(`${API}/forms/:id/submissions/`, () => json(fx.submission)),
  http.get(`${API}/forms/:id/statistics/`, () => json(fx.formStatistics)),
  http.get(`${API}/forms/`, () => json([fx.form, fx.groupForm])),
  http.get(`${API}/forms/:id/`, () => json(fx.form)),
  http.post(`${API}/forms/`, () => json(fx.form)),
  http.put(`${API}/forms/:id/`, () => json(fx.form)),
  http.delete(`${API}/forms/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Job posts / News / Emojis
  http.get(`${API}/jobposts/`, () => json(paginate([fx.jobPost]))),
  http.get(`${API}/jobposts/:id/`, () => json(fx.jobPost)),
  http.post(`${API}/jobposts/`, () => json(fx.jobPost)),
  http.put(`${API}/jobposts/:id/`, () => json(fx.jobPost)),
  http.delete(`${API}/jobposts/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/news/`, () => json(paginate([fx.news]))),
  http.get(`${API}/news/:id/`, () => json(fx.news)),
  http.post(`${API}/news/`, () => json(fx.news)),
  http.put(`${API}/news/:id/`, () => json(fx.news)),
  http.delete(`${API}/news/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.post(`${API}/emojis/reactions/`, () => json(fx.reaction)),
  http.put(`${API}/emojis/reactions/:id/`, () => json(fx.reaction)),
  http.delete(`${API}/emojis/reactions/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Users (specific before :userName)
  http.get(`${API}/users/me/permissions/`, () => json({ permissions })),
  http.get(`${API}/users/me/data/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.post(`${API}/users/me/slack/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/users/me/badges/`, () => json(paginate([fx.badge]))),
  http.post(`${API}/users/me/badges/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/users/me/events/`, () => json(paginate(fx.eventList))),
  http.get(`${API}/users/me/forms/`, () => json(paginate([fx.form]))),
  http.get(`${API}/users/me/strikes/`, () => json([fx.strike])),
  http.get(`${API}/users/me/`, () => json(users[0] satisfies User)),
  http.post(`${API}/users/activate/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.post(`${API}/users/decline/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/users/`, () => json(paginate(users))),
  http.get(`${API}/users/:userId/memberships/`, () => json(paginate(memberships) as PaginationResponse<Membership>)),
  http.get(`${API}/users/:userId/membership-histories/`, () => json(paginate([fx.membershipHistory]))),
  http.put(`${API}/users/:userName/`, () => json(users[0])),
  http.delete(`${API}/users/:userId/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Notification settings
  http.get(`${API}/notification-settings/choices/`, () => json([fx.userNotificationSettingChoice])),
  http.get(`${API}/notification-settings/`, () => json([fx.userNotificationSetting])),
  http.post(`${API}/notification-settings/`, () => json([fx.userNotificationSetting])),

  // Notifications / Short links
  http.get(`${API}/notifications/`, () => json(paginate([fx.notification]))),
  http.put(`${API}/notifications/:id/`, () => json(fx.notification)),
  http.get(`${API}/short-links/`, () => json([fx.shortLink])),
  http.post(`${API}/short-links/`, () => json(fx.shortLink)),
  http.delete(`${API}/short-links/:slug/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Gallery / Pictures (note: getPicture has no trailing slash)
  http.get(`${API}/galleries/:id/pictures/:pictureId`, () => json(fx.picture)),
  http.put(`${API}/galleries/:id/pictures/:pictureId/`, () => json(fx.picture)),
  http.delete(`${API}/galleries/:id/pictures/:pictureId`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/galleries/:id/pictures/`, () => json(paginate([fx.picture]))),
  http.post(`${API}/galleries/:id/pictures/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/galleries/`, () => json(paginate([fx.gallery]))),
  http.get(`${API}/galleries/:id/`, () => json(fx.gallery)),
  http.post(`${API}/galleries/`, () => json(fx.gallery)),
  http.put(`${API}/galleries/:id/`, () => json(fx.gallery)),
  http.delete(`${API}/galleries/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Strikes
  http.get(`${API}/strikes/`, () => json(paginate([fx.strikeList]))),
  http.post(`${API}/strikes/`, () => json(fx.strike)),
  http.delete(`${API}/strikes/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Cheatsheets / Categories
  http.get(`${API}/cheatsheets/*/*/files/`, () => json(paginate([fx.cheatsheet]))),
  http.get(`${API}/categories/`, () => json([fx.category])),

  // Badges (leaderboard/categories before :badgeId)
  http.get(`${API}/badges/leaderboard/`, () => json(paginate([fx.badgesOverallLeaderboard]))),
  http.get(`${API}/badges/categories/`, () => json(paginate([fx.badgeCategory]))),
  http.get(`${API}/badges/categories/:id/`, () => json(fx.badgeCategory)),
  http.get(`${API}/badges/:badgeId/leaderboard/`, () => json(paginate([fx.badgeLeaderboard]))),
  http.get(`${API}/badges/`, () => json(paginate([fx.badge]))),
  http.get(`${API}/badges/:badgeId/`, () => json(fx.badge)),

  // Group extras
  http.get(`${API}/groups/:slug/statistics/`, () => json(fx.groupMemberStatistics)),
  http.get(`${API}/groups/:slug/membership-histories/`, () => json(paginate([fx.membershipHistory]))),
  http.put(`${API}/groups/:slug/membership-histories/:id/`, () => json(fx.membershipHistory)),
  http.delete(`${API}/groups/:slug/membership-histories/:id/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
  http.get(`${API}/groups/:slug/forms/`, () => json([fx.groupForm])),
  http.put(`${API}/groups/:slug/`, () => json(group('kvark'))),
  http.post(`${API}/groups/`, () => json(group('mock-gruppe'))),

  // Wiki (tree before :path)
  http.get(`${API}/pages/tree/`, () => json(fx.wikiTree)),
  http.get(`${API}/pages/`, () => json(paginate([{ title: fx.wikiPage.title, slug: fx.wikiPage.slug, path: fx.wikiPage.path }]))),
  http.get(`${API}/pages/:path`, () => json(fx.wikiPage)),
  http.post(`${API}/pages/`, () => json(fx.wikiPage)),
  http.put(`${API}/pages/:path`, () => json(fx.wikiPage)),
  http.delete(`${API}/pages/:path`, () => json({ detail: 'OK' } satisfies RequestResponse)),

  // Upload / User bio / Feedback
  http.post(`${API}/upload/`, () => json({ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' })),
  http.post(`${API}/user-bios/`, () => json(users[0].bio)),
  http.put(`${API}/user-bios/:id/`, () => json(users[0].bio)),
  http.delete(`${API}/user-bios/:id/`, () => json(users[0].bio)),
  http.get(`${API}/user-bios/:id/`, () => json(users[0].bio)),
  http.get(`${API}/feedbacks/`, () => json(paginate([fx.feedback]))),
  http.post(`${API}/feedbacks/`, () => json(fx.feedback)),
  http.delete(`${API}/feedbacks/:id/`, () => json(fx.feedback)),

  // Company form
  http.post(`${API}/accept-form/`, () => json({ detail: 'OK' } satisfies RequestResponse)),
];
