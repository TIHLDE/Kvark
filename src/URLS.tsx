const WIKI = '/wiki/';
export const WIKI_URLS = {
  ABOUT_INDEX: 'tihlde/undergrupper/index/',
  CONTACT_US: 'kontakt-oss/',
  EVENT_RULES: 'annet/arrangementsregler/',
};

export default {
  cheatsheet: '/kokebok/',
  company: '/bedrifter/',
  contactInfo: `${WIKI}${WIKI_URLS.CONTACT_US}`,
  events: '/arrangementer/',
  eventRegister: 'registrering/',
  eventRules: `${WIKI}${WIKI_URLS.EVENT_RULES}`,
  forgotPassword: '/glemt-passord/',
  form: '/sporreskjema/',
  groups: '/grupper/',
  groups_fines: 'boter/',
  groups_laws: 'lovverk/',
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

  userAdmin: '/admin/brukere/',
  strikeAdmin: '/admin/prikker/',
  eventAdmin: '/admin/arrangementer/',
  jobpostsAdmin: '/admin/karriere/',
  newsAdmin: '/admin/nyheter/',
};
