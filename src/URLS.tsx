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
  landing: '/',
  events: '/arrangementer/',
  eventRegister: 'registrering/',
  company: '/bedrifter/',
  contactInfo: `${PAGES}${PAGES_URLS.CONTACT_US}`,
  newStudent: `${PAGES}${PAGES_URLS.NEW_STUDENT}`,
  jobposts: '/karriere/',
  profile: '/profil/',
  login: '/logg-inn/',
  groups: '/grupper/',
  forgotPassword: '/glemt-passord/',
  newlanding: '/newlanding/',
  signup: '/ny-bruker/',
  eventRules: `${PAGES}${PAGES_URLS.EVENT_RULES}`,
  cheatsheet: '/kokebok/',
  news: '/nyheter/',
  shortLinks: '/linker/',
  pages: PAGES,
  aboutIndex: `${PAGES}${PAGES_URLS.ABOUT_INDEX}`,

  fadderuka: '/fadderuka/',

  userAdmin: '/admin/brukere/',
  eventAdmin: '/admin/arrangementer/',
  jobpostsAdmin: '/admin/karriere/',
  newsAdmin: '/admin/nyheter/',
};
