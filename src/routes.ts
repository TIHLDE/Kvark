import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('./routes/__root.tsx', [
  route('/interesse', './pages/CompanyInterest/index.tsx'),
  layout('./pages/MainLayout.tsx', [
    index('./routes/landing/index.tsx'),
    route('/ny-student', './pages/NewStudent/index.tsx'),

    route('tilbakemelding', './pages/Feedback/index.tsx'),

    route('/arrangementer', [
      index('./routes/events/index.tsx'),
      route('/registrering/$id', './routes/events/registration.tsx'),
      route('/$id/{-$urlTitle}', './routes/events/detail.tsx'),
    ]),
    route('/bedrifter', './routes/info/companies.tsx'),
    route('/toddel', './pages/Toddel/index.tsx'),

    route('/sporreskjema', [
      route('/admin/$id', './routes/forms/admin.tsx'),
      route('/$id', './routes/forms/index.tsx'),
    ]),

    route('/grupper', [
      index('./routes/groups/index.tsx'),
      route('/$slug', './routes/groups/detail/layout.tsx', [
        index('./routes/groups/detail/about.tsx'),
        route('/arrangementer', './routes/groups/detail/events.tsx'),
        route('/boter', './routes/groups/detail/fines.tsx'),
        route('/lovverk', './routes/groups/detail/laws.tsx'),
        route('/sporreskjemaer', './routes/groups/detail/forms.tsx'),
      ]),
    ]),
    route('/interessegrupper', './routes/groups/interest.tsx'),

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

    route('/nyheter', [
      index('./routes/news/index.tsx'),
      route('/$id/{-$urlTitle}', './routes/news/detail.tsx'),
    ]),

    route('/profil/{-$userId}', './pages/Profile/index.tsx'),
    route('/kokebok/{-$studyId}/{-$classId}', './pages/Cheatsheet/index.tsx'),
    route('/qr-koder', './pages/QRCodes/index.tsx'),
    route('/opptak', './routes/groups/admissions.tsx'),

    route('/admin', [
      // WTF why is this in the components folder?
      route('/bannere', './components/miscellaneous/InfoBanner/InfoBannerAdmin.tsx'),
      route('/ny-gruppe', './routes/admin/new-group.tsx'),
      route('/stillingsannonser/{-$jobPostId}', './routes/admin/jobs-editor.tsx'),
      route('/arrangementer/{-$eventId}', './pages/EventAdministration/index.tsx'),
      route('/nyheter/{-$newsId}', './routes/admin/news-editor.tsx'),
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
