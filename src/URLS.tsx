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

export default {
  cheatsheet: '/kokebok/',
  company: '/bedrifter/',
  contactInfo: `${PAGES}${PAGES_URLS.CONTACT_US}`,
  events: '/arrangementer/',
  eventRegister: 'registrering/',
  eventRules: `${PAGES}${PAGES_URLS.EVENT_RULES}`,
  forgotPassword: '/glemt-passord/',
  form: '/sporreskjema/',
  groups: '/grupper/',
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
  eventAdmin: '/admin/arrangementer/',
  jobpostsAdmin: '/admin/karriere/',
  newsAdmin: '/admin/nyheter/',
};
