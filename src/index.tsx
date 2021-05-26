import { ReactElement, ReactNode, useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/index.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import URLS from 'URLS';
import 'delayed-scroll-restoration-polyfill';
import { PermissionApp } from 'types/Enums';

// Services
import { ThemeProvider } from 'context/ThemeContext';
import { useMisc, MiscProvider } from 'api/hooks/Misc';
import { useHavePermission, useIsAuthenticated } from 'api/hooks/User';
import { SnackbarProvider } from 'api/hooks/Snackbar';

// Project components
import MessageGDPR from 'components/miscellaneous/MessageGDPR';
import Page from 'components/navigation/Page';
import Navigation from 'components/navigation/Navigation';

// Project containers
import Companies from 'containers/Companies';
import EventDetails from 'containers/EventDetails';
import Landing from 'containers/Landing';
const Cheatsheet = lazy(() => import(/* webpackChunkName: "cheatsheet" */ 'containers/Cheatsheet'));
const Events = lazy(() => import(/* webpackChunkName: "events" */ 'containers/Events'));
const JobPosts = lazy(() => import(/* webpackChunkName: "jobposts" */ 'containers/JobPosts'));
const JobPostDetails = lazy(() => import(/* webpackChunkName: "jobpost_details" */ 'containers/JobPostDetails'));
const NewsDetails = lazy(() => import(/* webpackChunkName: "news_details" */ 'containers/NewsDetails'));
const Pages = lazy(() => import(/* webpackChunkName: "pages" */ 'containers/Pages'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ 'containers/Profile'));
const EventAdministration = lazy(() => import(/* webpackChunkName: "event_administration" */ 'containers/EventAdministration'));
const EventRegistration = lazy(() => import(/* webpackChunkName: "event_registration" */ 'containers/EventRegistration'));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot_password" */ 'containers/ForgotPassword'));
const GroupOverview = lazy(() => import(/* webpackChunkName: "group_overview" */ 'containers/GroupOverview'));
const Http404 = lazy(() => import(/* webpackChunkName: "http404" */ 'containers/Http404'));
const JobPostAdministration = lazy(() => import(/* webpackChunkName: "jobpost_administration" */ 'containers/JobPostAdministration'));
const LogIn = lazy(() => import(/* webpackChunkName: "login" */ 'containers/LogIn'));
const News = lazy(() => import(/* webpackChunkName: "news" */ 'containers/News'));
const NewsAdministration = lazy(() => import(/* webpackChunkName: "news_administration" */ 'containers/NewsAdministration'));
const ShortLinks = lazy(() => import(/* webpackChunkName: "short_links" */ 'containers/ShortLinks'));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ 'containers/SignUp'));
const UserAdmin = lazy(() => import(/* webpackChunkName: "user_admin" */ 'containers/UserAdmin'));
const GroupAdmin = lazy(() => import(/* webpackChunkName: "group_admin" */ 'containers/GroupAdmin'));

type AuthRouteProps = {
  apps?: Array<PermissionApp>;
  path: string;
  element?: ReactElement | null;
  children?: ReactNode;
};

const AuthRoute = ({ apps = [], children, path, element }: AuthRouteProps) => {
  const { setLogInRedirectURL } = useMisc();
  const isAuthenticated = useIsAuthenticated();
  const { allowAccess, isLoading } = useHavePermission(apps);

  if (isLoading) {
    return <Page />;
  } else if (!isAuthenticated) {
    setLogInRedirectURL(window.location.pathname);
    return <Navigate to={URLS.login} />;
  } else if (allowAccess || !apps.length) {
    return (
      <Route element={element} path={path}>
        {children}
      </Route>
    );
  } else {
    return <Navigate to={URLS.landing} />;
  }
};

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // Don't refetch data before 2 min has passed
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MiscProvider>
        <ThemeProvider>
          <CssBaseline />
          <SnackbarProvider>{children}</SnackbarProvider>
        </ThemeProvider>
      </MiscProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  useEffect(() => {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }, [location]);
  return (
    <Navigation>
      <Routes>
        <Route element={<Landing />} path='/' />
        <Route path={URLS.events}>
          <AuthRoute apps={[PermissionApp.EVENT]} element={<EventRegistration />} path=':id/registrering/' />
          <Route element={<EventDetails />} path=':id/*' />
          <Route element={<Events />} path='' />
        </Route>
        <Route element={<Companies />} path={URLS.company} />
        <Route element={<GroupOverview />} path={URLS.groups} />
        <Route path={URLS.jobposts}>
          <Route element={<JobPostDetails />} path=':id/*' />
          <Route element={<JobPosts />} path='' />
        </Route>
        <Route element={<Pages />} path={`${URLS.pages}*`} />
        <Route path={URLS.news}>
          <Route element={<NewsDetails />} path=':id/*' />
          <Route element={<News />} path='' />
        </Route>

        <AuthRoute element={<Profile />} path={URLS.profile} />

        <AuthRoute element={<Cheatsheet />} path={`${URLS.cheatsheet}:studyId/:classId/`} />
        <AuthRoute element={<Cheatsheet />} path={`${URLS.cheatsheet}*`} />
        <AuthRoute element={<ShortLinks />} path={URLS.shortLinks} />

        <AuthRoute apps={[PermissionApp.USER]} element={<UserAdmin />} path={URLS.userAdmin} />
        <AuthRoute apps={[PermissionApp.JOBPOST]} path={URLS.jobpostsAdmin}>
          <Route element={<JobPostAdministration />} path=':jobPostId/' />
          <Route element={<JobPostAdministration />} path='' />
        </AuthRoute>
        <AuthRoute apps={[PermissionApp.EVENT]} path={URLS.eventAdmin}>
          <Route element={<EventAdministration />} path=':eventId/' />
          <Route element={<EventAdministration />} path='' />
        </AuthRoute>
        <AuthRoute apps={[PermissionApp.NEWS]} path={URLS.newsAdmin}>
          <Route element={<NewsAdministration />} path=':newsId/' />
          <Route element={<NewsAdministration />} path='' />
        </AuthRoute>

        <Route element={<GroupAdmin />} path={`${URLS.groups}:slug/`} />

        <Route element={<LogIn />} path={URLS.login} />
        <Route element={<ForgotPassword />} path={URLS.forgotPassword} />
        <Route element={<SignUp />} path={URLS.signup} />

        <Route element={<Http404 />} path='*' />
      </Routes>
    </Navigation>
  );
};

export const Application = () => {
  return (
    <Providers>
      <BrowserRouter>
        <Suspense fallback={<Navigation isLoading />}>
          <AppRoutes />
          <MessageGDPR />
        </Suspense>
      </BrowserRouter>
    </Providers>
  );
};

// eslint-disable-next-line no-console
console.log(
  '%cLaget av %cIndex',
  'font-weight: bold; font-size: 1rem;color: yellow;',
  'font-weight: bold; padding-bottom: 10px; padding-right: 10px; font-size: 3rem;color: yellow; text-shadow: 3px 3px 0 rgb(217,31,38), 6px 6px 0 rgb(226,91,14), 9px 9px 0 green, 12px 12px 0 rgb(5,148,68), 15px 15px 0 rgb(2,135,206), 18px 18px 0 rgb(4,77,145), 21px 21px 0 rgb(42,21,113)',
);
// eslint-disable-next-line no-console
console.log('%cSnoker du rundt? Det liker vi. Vi i Index ser alltid etter nye medlemmer.', 'font-weight: bold; font-size: 1rem;color: yellow;', '');

ReactDOM.render(<Application />, document.getElementById('root'));
