import { ReactElement, ReactNode, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import URLS from 'URLS';
import { PermissionApp } from 'types/Enums';

// Services
import { useSetRedirectUrl } from 'api/hooks/Misc';
import { useHavePermission, useIsAuthenticated } from 'api/hooks/User';

// Project components
import Page from 'components/navigation/Page';

// Project containers
import Companies from 'containers/Companies';
import EventDetails from 'containers/EventDetails';
import Landing from 'containers/Landing';
import Profile from 'containers/Profile';
import Events from 'containers/Events';
import JobPosts from 'containers/JobPosts';
import JobPostDetails from 'containers/JobPostDetails';
import NewsDetails from 'containers/NewsDetails';
import GroupOverview from 'containers/GroupOverview';
import News from 'containers/News';

const Cheatsheet = lazy(() => import(/* webpackChunkName: "cheatsheet" */ 'containers/Cheatsheet'));
const EventAdministration = lazy(() => import(/* webpackChunkName: "event_administration" */ 'containers/EventAdministration'));
const EventRegistration = lazy(() => import(/* webpackChunkName: "event_registration" */ 'containers/EventRegistration'));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot_password" */ 'containers/ForgotPassword'));
const GroupAdmin = lazy(() => import(/* webpackChunkName: "group_admin" */ 'containers/GroupAdmin'));
const Http404 = lazy(() => import(/* webpackChunkName: "http404" */ 'containers/Http404'));
const JobPostAdministration = lazy(() => import(/* webpackChunkName: "jobpost_administration" */ 'containers/JobPostAdministration'));
const LogIn = lazy(() => import(/* webpackChunkName: "login" */ 'containers/LogIn'));
const NewsAdministration = lazy(() => import(/* webpackChunkName: "news_administration" */ 'containers/NewsAdministration'));
const Pages = lazy(() => import(/* webpackChunkName: "pages" */ 'containers/Pages'));
const ShortLinks = lazy(() => import(/* webpackChunkName: "short_links" */ 'containers/ShortLinks'));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ 'containers/SignUp'));
const UserAdmin = lazy(() => import(/* webpackChunkName: "user_admin" */ 'containers/UserAdmin'));

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
  useEffect(() => {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }, [location]);
  return (
    <Suspense fallback={<Page options={{ title: 'Laster...', filledTopbar: true }} />}>
      <Routes>
        <Route element={<Landing />} path='/' />
        <Route path={URLS.events}>
          <AuthRoute apps={[PermissionApp.EVENT]} element={<EventRegistration />} path={`:id/${URLS.eventRegister}`} />
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
    </Suspense>
  );
};

export default AppRoutes;
