import type { Badge, BadgeCategory, Group } from '~/types';

const WIKI = 'https://wiki.tihlde.org/';
export const WIKI_URLS = {
  ABOUT_INDEX: 'https://wiki.tihlde.org/instruks-index',
  CONTACT_US: 'https://wiki.tihlde.org/kontakt',
  EVENT_RULES: 'https://wiki.tihlde.org/arrangementer',
};

const URLS = {
  badges: {
    index: '/badges/',
    category_relative: 'kategorier/',
    categories: () => `${URLS.badges.index}${URLS.badges.category_relative}`,
    category_leaderboard: (categoryId: BadgeCategory['id']) => `${URLS.badges.categories()}${categoryId}/`,
    category_badges_relative: 'badges/',
    category_badges: (categoryId: BadgeCategory['id']) => `${URLS.badges.category_leaderboard(categoryId)}${URLS.badges.category_badges_relative}`,
    public_badges_relative: 'alle/',
    public_badges: () => `${URLS.badges.index}${URLS.badges.public_badges_relative}`,
    badge_leaderboard: (badgeId: Badge['id']) => `${URLS.badges.index}${badgeId}/`,
    get_badge_relative: 'erverv/',
    get_badge: () => `${URLS.badges.index}${URLS.badges.get_badge_relative}`,
  },
  feedback: '/tilbakemelding/',
  cheatsheet: '/kokebok/',
  company: '/bedrifter/',
  contactInfo: `${WIKI}${WIKI_URLS.CONTACT_US}`,
  events: '/arrangementer/',
  eventRegister: 'registrering/',
  eventRules: `${WIKI}${WIKI_URLS.EVENT_RULES}`,
  forgotPassword: '/glemt-passord/',
  form: '/sporreskjema/',
  groups: {
    index: '/grupper/',
    details: (groupSlug: Group['slug']) => `${URLS.groups.index}${groupSlug}/`,
    events_relative: 'arrangementer/',
    events: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.events_relative}`,
    fines_relative: 'boter/',
    fines: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.fines_relative}`,
    forms_relative: 'sporreskjema/',
    forms: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.forms_relative}`,
    laws_relative: 'lovverk/',
    laws: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.laws_relative}`,
  },
  jobposts: '/stillingsannonser/',
  landing: '/',
  login: '/logg-inn/',
  newStudent: '/ny-student/',
  news: '/nyheter/',
  toddel: '/toddel/',
  wiki: WIKI,
  aboutIndex: `${WIKI}${WIKI_URLS.ABOUT_INDEX}`,
  profile: '/profil/',
  signup: '/ny-bruker/',
  signupForm: '/ny-bruker/skjema/',
  signupFeide: '/ny-bruker/feide/',
  shortLinks: '/linker/',
  qrCodes: '/qr-koder/',
  gallery: '/galleri/',
  userAdmin: '/admin/brukere/',
  newGroupAdmin: '/admin/ny-gruppe/',
  strikeAdmin: '/admin/prikker/',
  eventAdmin: '/admin/arrangementer/',
  jobpostsAdmin: '/admin/stillingsannonser/',
  newsAdmin: '/admin/nyheter/',
  bannerAdmin: '/admin/bannere/',
  jubilee: 'https://jubileum.tihlde.org/',
  fondet: 'https://fondet.tihlde.org/',
  kontRes: 'https://kontres.tihlde.org/',
  github: 'https://github.com/TIHLDE',
  pythons: 'https://pythons.tihlde.org/',
  pythonsLadies: 'https://pythons-damer.tihlde.org/',
  changelog: '/endringslogg',
  admissions: '/opptak/',
} as const;

export default URLS;
