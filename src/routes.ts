import { index, route, type RouteConfig } from '@react-router/dev/routes';

/* prettier-ignore */
export default [
  index('./pages/Landing/index.tsx'),
  route('ny-student', './pages/NewStudent/index.tsx'),
  route('tilbakemelding', './pages/Feedback/index.tsx'),
  route('arrangementer', './pages/Events/index.tsx', [
    route(':id/*?', './pages/EventDetails/index.tsx'),
    route('registrering/:id', './pages/EventRegistration/index.tsx'), 
  ]),
] satisfies RouteConfig;
