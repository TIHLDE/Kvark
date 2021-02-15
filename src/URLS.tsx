const PAGES = '/om/';
export const PAGES_URLS = {
  ABOUT_INDEX: 'tihlde/undergrupper/index/',
};

export default {
  landing: '/',
  events: '/arrangementer/',
  company: '/bedrifter/',
  about: '/om-tihlde/',
  contactInfo: '/kontakt/',
  services: '/tjenester/',
  newStudent: '/nystudent/',
  jobposts: '/karriere/',
  profile: '/profil/',
  login: '/logg-inn/',
  forgotPassword: '/glemt-passord/',
  laws: '/lover/',
  newlanding: '/newlanding/',
  signup: '/ny-bruker/',
  privacyPolicy: '/personvern/',
  eventRules: '/arrangementsregler/',
  cheatsheet: '/kokebok/',
  news: '/nyheter/',
  pages: PAGES,
  aboutIndex: `${PAGES}${PAGES_URLS.ABOUT_INDEX}`,

  userAdmin: '/admin/brukere/',
  eventAdmin: '/admin/arrangementer/',
  jobpostsAdmin: '/admin/karriere/',
  newsAdmin: '/admin/nyheter/',
};
