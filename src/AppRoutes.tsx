import { ReactElement, ReactNode, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import URLS from 'URLS';
import { PermissionApp } from 'types/Enums';

// Services
import { useSetRedirectUrl } from 'hooks/Misc';
import { useHavePermission, useIsAuthenticated } from 'hooks/User';

// Project components
import Page from 'components/navigation/Page';

// Project pages
import Companies from 'pages/Companies';
import EventDetails from 'pages/EventDetails';
import Landing from 'pages/Landing';
import Profile from 'pages/Profile';
import Events from 'pages/Events';
import JobPosts from 'pages/JobPosts';
import JobPostDetails from 'pages/JobPostDetails';
import NewsDetails from 'pages/NewsDetails';
import GroupOverview from 'pages/GroupOverview';
import News from 'pages/News';
import NewStudent from 'pages/NewStudent';
import { useGoogleAnalytics } from 'hooks/Utils';

const Cheatsheet = lazy(() => import(/* webpackChunkName: "cheatsheet" */ 'pages/Cheatsheet'));
const EventAdministration = lazy(() => import(/* webpackChunkName: "event_administration" */ 'pages/EventAdministration'));
const EventRegistration = lazy(() => import(/* webpackChunkName: "event_registration" */ 'pages/EventRegistration'));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot_password" */ 'pages/ForgotPassword'));
const Form = lazy(() => import(/* webpackChunkName: "form" */ 'pages/Form'));
const GroupAdmin = lazy(() => import(/* webpackChunkName: "group_admin" */ 'pages/GroupAdmin'));
const Http404 = lazy(() => import(/* webpackChunkName: "http404" */ 'pages/Http404'));
const JobPostAdministration = lazy(() => import(/* webpackChunkName: "jobpost_administration" */ 'pages/JobPostAdministration'));
const LogIn = lazy(() => import(/* webpackChunkName: "login" */ 'pages/LogIn'));
const NewsAdministration = lazy(() => import(/* webpackChunkName: "news_administration" */ 'pages/NewsAdministration'));
const Pages = lazy(() => import(/* webpackChunkName: "pages" */ 'pages/Pages'));
const ShortLinks = lazy(() => import(/* webpackChunkName: "short_links" */ 'pages/ShortLinks'));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ 'pages/SignUp'));
const UserAdmin = lazy(() => import(/* webpackChunkName: "user_admin" */ 'pages/UserAdmin'));

type AuthRouteProps = {
  apps?: Array<PermissionApp>;
  path: string;
  element?: ReactElement | null;
  children?: ReactNode;
};

const AuthRoute = ({ apps = [], children, path, element }: AuthRouteProps) => {
  const setLogInRedirectURL = useSetRedirectUrl();
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

const AppRoutes = () => {
  const location = useLocation();
  const { event } = useGoogleAnalytics();

  useEffect(() => event('page_view', window.location.href, window.location.pathname), [location]);

  return (
    <Suspense fallback={<Page options={{ title: 'Laster...', filledTopbar: true }} />}>
      <Routes>
        <Route element={<Landing />} path='/' />
        <Route element={<NewStudent />} path={URLS.newStudent} />
        <Route path={URLS.events}>
          <AuthRoute apps={[PermissionApp.EVENT]} element={<EventRegistration />} path={`:id/${URLS.eventRegister}`} />
          <Route element={<EventDetails />} path=':id/*' />
          <Route element={<Events />} path='' />
        </Route>
        <Route element={<Companies />} path={URLS.company} />
        <Route element={<Form />} path={`${URLS.form}:id/`} />
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
    </Suspense>
  );
};

export default AppRoutes;
