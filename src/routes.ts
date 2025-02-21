import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes';

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
        route('boter', './pages/Groups/fines/index.tsx'),
        route('lovverk', './pages/Groups/laws/index.tsx'),
        route('sporreskjema', './pages/Groups/forms/index.tsx'),
      ]),
    ]),

    route('kokebok/:studyId?/:recipeId?', './pages/Cheatsheet/index.tsx'),
  ]),
] satisfies RouteConfig;
