import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes';

// TODO: Go through all routes and check if they work
export default [
  layout('./pages/MainLayout.tsx', [
    index('./pages/Landing/index.tsx'),
    route('ny-student', './pages/NewStudent/index.tsx'),

    route('tilbakemelding', './pages/Feedback/index.tsx'),

    ...prefix('arrangementer', [
      index('./pages/Events/index.tsx'),
      // INFO: This route has been re-written from :id/registrering
      route('registrering/:id', './pages/EventRegistration/index.tsx'),
      route(':id/:urlTitle?', './pages/EventDetails/index.tsx'),
    ]),
    route('bedrifter', './pages/Companies/index.tsx'),
    route('toddel', './pages/Toddel/index.tsx'),

    ...prefix('sporreskjema', [
      route('admin/:id', './pages/Form/FormAdmin.tsx'),
      route(':id', './pages/Form/index.tsx'),
      //
    ]),

    ...prefix('grupper', [
      index('./pages/Groups/overview/index.tsx'),

      route(':slug', './pages/Groups/GroupDetails.tsx', [
        index('./pages/Groups/about/index.tsx'),
        route('arrangementer', './pages/Groups/events/index.tsx'),
        // TODO: Add a button to create a new fine
        route('boter', './pages/Groups/fines/index.tsx'),
        route('lovverk', './pages/Groups/laws/index.tsx'),
        route('sporreskjemaer', './pages/Groups/forms/index.tsx'),
      ]),
    ]),
    route('interessegrupper', './pages/InterestGroups/index.tsx'),

    ...prefix('badges', [
      layout('./pages/Badges/index.tsx', [
        index('./pages/Badges/overview/BadgesOverallLeaderboard.tsx'),
        route('kategorier', './pages/Badges/overview/BadgeCategoriesList.tsx'),
        route('alle', './pages/Badges/overview/BadgesList.tsx'),
        route('erverv/:badgeId?', './pages/Badges/get/index.tsx'),
      ]),
      route('kategorier/:categoryId', './pages/Badges/category/index.tsx', [
        index('./pages/Badges/category/BadgesCategoryLeaderboard.tsx'),
        //
        route('badges', './pages/Badges/category/CategoryBadgesList.tsx'),
      ]),
      route(':badgeId', './pages/Badges/details/index.tsx'),
    ]),

    //
    ...prefix('stillingsannonser', [
      index('./pages/JobPosts/index.tsx'),
      //
      route(':id/:urlTitle?', './pages/JobPostDetails/index.tsx'),
    ]),

    ...prefix('galleri', [
      index('./pages/Gallery/index.tsx'),
      route(':id/:urlTitle?', './pages/GalleryDetails/index.tsx'),
      //
    ]),

    // Redirects to new wiki: https://wiki.tihlde.org/
    route('wiki/*', './pages/Wiki/index.tsx'),
    route('wiki-old/*', './pages/Wiki/index.old.tsx'),

    ...prefix('nyheter', [
      index('./pages/News/index.tsx'),
      route(':id/:urlTitle?', './pages/NewsDetails/index.tsx'),
      //
    ]),

    route('profil/:userId?', './pages/Profile/index.tsx'),
    route('kokebok/:studyId?/:classId?', './pages/Cheatsheet/index.tsx'),
    route('linker', './pages/ShortLinks/index.tsx'),
    route('qr-koder', './pages/QRCodes/index.tsx'),
    route('opptak', './pages/Admissions/index.tsx'),

    ...prefix('admin', [
      // WTF why is this in the components folder?
      route('bannere', './components/miscellaneous/InfoBanner/InfoBannerAdmin.tsx'),
      route('ny-gruppe', './pages/NewGroupAdministration/index.tsx'),
      route('stillingsannonser/:jobPostId?', './pages/JobPostAdministration/index.tsx'),
      route('arrangementer/:eventId?', './pages/EventAdministration/index.tsx'),
      route('nyheter/:newsId?', './pages/NewsAdministration/index.tsx'),
      route('brukere', './pages/UserAdmin/index.tsx'),
      route('prikker', './pages/StrikeAdmin/index.tsx'),
    ]),

    route('logg-inn', './pages/LogIn/index.tsx'),
    route('glemt-passord', './pages/ForgotPassword/index.tsx'),
    route('ny-bruker/skjema', './pages/SignUp/index.tsx'),
    route('ny-bruker', './pages/SignUpOptions/index.tsx'),
    route('ny-bruker/feide', './pages/SignUpFeide/index.tsx'),
    route('endringslogg', './pages/Changelog/index.tsx'),

    // IMPORTANT! Keep this at the bottom
    route('*', './pages/Http404/index.tsx'),
  ]),
] satisfies RouteConfig;
