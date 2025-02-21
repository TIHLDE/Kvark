import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes';

// TODO: Go through all routes and check if they work
export default [
  layout('./pages/MainLayout.tsx', [
    index('./pages/Landing/index.tsx'),
    route('ny-student', './pages/NewStudent/index.tsx'),

    // TODO: Auth this route
    route('tilbakemelding', './pages/Feedback/index.tsx'),

    ...prefix('arrangementer', [
      index('./pages/Events/index.tsx'),
      // TODO: Auth this route (PermissionApp.EVENT)
      // TODO: This route has also been re-written from :id/registrering
      route('registrering/:id', './pages/EventRegistration/index.tsx'),
      route(':id/:urlTitle?', './pages/EventDetails/index.tsx'),
    ]),
    route('bedrifter', './pages/Companies/index.tsx'),
    // FIX: Borked route
    // route('toddel', './pages/Toddel/index.tsx'),

    ...prefix('sporreskjema', [
      // TODO: Auth this route (PermissionApp.GROUPFORM)
      route('admin/:id', './pages/Form/FormAdmin.tsx'),
      // TODO: Auth this route
      route(':id', './pages/Form/index.tsx'),
    ]),

    ...prefix('grupper', [
      index('./pages/Groups/overview/index.tsx'),

      // TODO: Auth is not required but content on these is dependent on auth
      route(':slug', './pages/Groups/GroupDetails.tsx', [
        index('./pages/Groups/about/index.tsx'),
        route('arrangementer', './pages/Groups/events/index.tsx'),
        // TODO: Add a button to create a new fine
        route('boter', './pages/Groups/fines/index.tsx'),
        route('lovverk', './pages/Groups/laws/index.tsx'),
        route('sporreskjemaer', './pages/Groups/forms/index.tsx'),
      ]),
    ]),

    // TODO: Badges endpoints has not been tested
    ...prefix('badges', [
      layout('./pages/Badges/index.tsx', [
        index('./pages/Badges/BadgesLeaderboard.tsx'),
        route('kategorier', './pages/Badges/overview/BadgeCategoriesList.tsx'),
        route('alle', './pages/Badges/overview/BadgesList.tsx'),
        // TODO: Auth this route
        route('erverv/:badgeId?', './pages/Badges/get/index.tsx'),
      ]),
      route('kategorier/:categoryId', './pages/Badges/category/index.tsx', [
        index('./pages/Badges/category/BadgesCategoryLeaderboard.tsx'),
        //
        // TODO: Remix cant have the same file twice. Make a new file for this
        // route('badges', './pages/Badges/overview/BadgesList.tsx'),
      ]),
      route(':badgeId', './pages/Badges/details/index.tsx'),
    ]),

    //
    ...prefix('karriere', [
      index('./pages/JobPosts/index.tsx'),
      //
      route(':id/:urlTitle?', './pages/JobPostDetails/index.tsx'),
    ]),

    ...prefix('galleri', [
      index('./pages/Gallery/index.tsx'),
      // TODO: Borked route
      route(':id/:urlTitle?', './pages/GalleryDetails/index.tsx'),
    ]),

    // Redirects to new wiki: https://wiki.tihlde.org/
    route('wiki/*', './pages/Wiki/index.tsx'),

    ...prefix('nyheter', [
      index('./pages/News/index.tsx'),
      route(':id/:urtlTitle?', './pages/NewsDetails/index.tsx'),
      //
    ]),

    // TODO: Auth these routes
    route('profil/:userId?', './pages/Profile/index.tsx'),
    route('kokebok/:studyId?/:recipeId?', './pages/Cheatsheet/index.tsx'),
    route('linker', './pages/ShortLinks/index.tsx'),
    route('qr-koder', './pages/QRCodes/index.tsx'),
    route('opptak', './pages/Admissions/index.tsx'),

    // TODO: Auth these routes
    ...prefix('admin', [
      // TODO: Auth PermissionApp.BANNERS
      // WTF why is this in the components folder?
      route('bannere', './components/miscellaneous/InfoBanner/InfoBannerAdmin.tsx'),
      // TODO: Auth PermissionApp.GROUP
      route('ny-gruppe', './pages/NewGroupAdministration/index.tsx'),
      // TODO: Auth PermissionApp.JOBPOST
      route('karriere/:jobPostId?', './pages/JobPostAdministration/index.tsx'),
      // TODO: Auth PermissionApp.EVENT
      route('arrangementer/:eventId?', './pages/EventAdministration/index.tsx'),
      // TODO: Auth PermissionApp.NEWS
      route('nyheter/:newsId?', './pages/NewsAdministration/index.tsx'),
      // TODO: Auth PermissionApp.USER
      route('brukere', './pages/UserAdmin/index.tsx'),
      // TODO: Auth PermissionApp.STRIKE
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
