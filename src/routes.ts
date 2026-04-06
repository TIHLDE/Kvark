import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('./routes/__root.tsx', [
  route('/interesse', './pages/CompanyInterest/index.tsx'),
  layout('./pages/MainLayout.tsx', [
    index('./pages/Landing/index.tsx'),
    route('/ny-student', './pages/NewStudent/index.tsx'),

    route('tilbakemelding', './pages/Feedback/index.tsx'),

    route('/arrangementer', [
      index('./pages/Events/index.tsx'),
      // INFO: This route has been re-written from :id/registrering
      route('/registrering/$id', './pages/EventRegistration/index.tsx'),
      route('/$id/{-$urlTitle}', './pages/EventDetails/index.tsx'),
    ]),
    route('/bedrifter', './routes/info/companies.tsx'),
    route('/toddel', './pages/Toddel/index.tsx'),

    route('/sporreskjema', [
      route('/admin/$id', './routes/forms/admin.tsx'),
      route('/$id', './routes/forms/index.tsx'),
    ]),

    route('/grupper', [
      index('./pages/Groups/overview/index.tsx'),

      route('/$slug', './pages/Groups/GroupDetails.tsx', [
        index('./pages/Groups/about/index.tsx'),
        route('/arrangementer', './pages/Groups/events/index.tsx'),
        // TODO: Add a button to create a new fine
        route('/boter', './pages/Groups/fines/index.tsx'),
        route('/lovverk', './pages/Groups/laws/index.tsx'),
        route('/sporreskjemaer', './pages/Groups/forms/index.tsx'),
      ]),
    ]),
    route('/interessegrupper', './pages/InterestGroups/index.tsx'),

    //
    route('stillingsannonser', [
      index('./routes/jobs/index.tsx'),
      route('/$id/{-$urlTitle}', './routes/jobs/detail.tsx'),
    ]),

    route('/galleri', [
      index('./pages/Gallery/index.tsx'),
      route('/$id/{-$urlTitle}', './pages/GalleryDetails/index.tsx'),
      //
    ]),

    // Redirects to new wiki: https://wiki.tihlde.org/
    route('/nyheter', [
      index('./pages/News/index.tsx'),
      route('/$id/{-$urlTitle}', './pages/NewsDetails/index.tsx'),
      //
    ]),

    route('/profil/{-$userId}', './pages/Profile/index.tsx'),
    route('/kokebok/{-$studyId}/{-$classId}', './pages/Cheatsheet/index.tsx'),
    route('/qr-koder', './pages/QRCodes/index.tsx'),
    route('/opptak', './pages/Admissions/index.tsx'),

    route('/admin', [
      // WTF why is this in the components folder?
      route('/bannere', './components/miscellaneous/InfoBanner/InfoBannerAdmin.tsx'),
      route('/ny-gruppe', './pages/NewGroupAdministration/index.tsx'),
      route('/stillingsannonser/{-$jobPostId}', './routes/admin/jobs-editor.tsx'),
      route('/arrangementer/{-$eventId}', './pages/EventAdministration/index.tsx'),
      route('/nyheter/{-$newsId}', './pages/NewsAdministration/index.tsx'),
      route('/brukere', './pages/UserAdmin/index.tsx'),
      route('/prikker', './pages/StrikeAdmin/index.tsx'),
      route('/opptak', './pages/Opptak/index.tsx'),
    ]),

    route('/logg-inn', './routes/auth/login.tsx'),
    route('/glemt-passord', './routes/auth/forgot-password.tsx'),

    route('ny-bruker', [
      index('./routes/auth/new-account.tsx'),
      route('/skjema', './pages/SignUp/index.tsx'),
      route('/feide', './pages/SignUpFeide/index.tsx'),
      //
    ]),
    route('/personvern', './routes/info/privacy.tsx'),
  ]),
]);
