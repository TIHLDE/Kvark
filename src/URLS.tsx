import { Group } from 'types';

const PAGES = '/om/';
export const PAGES_URLS = {
  ABOUT_INDEX: 'tihlde/undergrupper/index/',
  CONTACT_US: 'kontakt-oss/',
  EVENT_RULES: 'annet/arrangementsregler/',
  NEW_STUDENT: 'ny-student/',
  SOSIALEN: 'tihlde/undergrupper/sosialen/',
  DRIFT: 'tihlde/undergrupper/drift/',
  NOK: 'tihlde/undergrupper/nringsliv-og-kurs/',
  PROMO: 'tihlde/undergrupper/promo/',
};

const URLS = {
  cheatsheet: '/kokebok/',
  company: '/bedrifter/',
  contactInfo: `${PAGES}${PAGES_URLS.CONTACT_US}`,
  events: '/arrangementer/',
  eventRegister: 'registrering/',
  eventRules: `${PAGES}${PAGES_URLS.EVENT_RULES}`,
  forgotPassword: '/glemt-passord/',
  form: '/sporreskjema/',
  groups: {
    index: '/grupper/',
    details: (groupSlug: Group['slug']) => `${URLS.groups.index}${groupSlug}/`,
    fines_relative: 'boter/',
    fines: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.fines_relative}`,
    forms_relative: 'skjemaer/',
    forms: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.forms_relative}`,
    laws_relative: 'lovverk/',
    laws: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.laws_relative}`,
  },
  jobposts: '/karriere/',
  landing: '/',
  login: '/logg-inn/',
  newStudent: '/ny-student/',
  news: '/nyheter/',
  pages: PAGES,
  aboutIndex: `${PAGES}${PAGES_URLS.ABOUT_INDEX}`,
  profile: '/profil/',
  signup: '/ny-bruker/',
  shortLinks: '/linker/',

  userAdmin: '/admin/brukere/',
  strikeAdmin: '/admin/prikker/',
  eventAdmin: '/admin/arrangementer/',
  jobpostsAdmin: '/admin/karriere/',
  newsAdmin: '/admin/nyheter/',
};

export default URLS;
