import { Group } from 'types';

const WIKI = '/wiki/';
export const WIKI_URLS = {
  ABOUT_INDEX: 'tihlde/undergrupper/index/',
  CONTACT_US: 'kontakt-oss/',
  EVENT_RULES: 'annet/arrangementsregler/',
};

const URLS = {
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
    fines_relative: 'boter/',
    fines: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.fines_relative}`,
    forms_relative: 'sporreskjema/',
    forms: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.forms_relative}`,
    laws_relative: 'lovverk/',
    laws: (groupSlug: Group['slug']) => `${URLS.groups.details(groupSlug)}${URLS.groups.laws_relative}`,
  },
  jobposts: '/karriere/',
  landing: '/',
  login: '/logg-inn/',
  newStudent: '/ny-student/',
  news: '/nyheter/',
  wiki: WIKI,
  aboutIndex: `${WIKI}${WIKI_URLS.ABOUT_INDEX}`,
  profile: '/profil/',
  signup: '/ny-bruker/',
  shortLinks: '/linker/',
  gallery: '/albumer/',
  userAdmin: '/admin/brukere/',
  strikeAdmin: '/admin/prikker/',
  eventAdmin: '/admin/arrangementer/',
  jobpostsAdmin: '/admin/karriere/',
  newsAdmin: '/admin/nyheter/',
};

export default URLS;
