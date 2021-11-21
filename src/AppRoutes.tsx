import { ReactElement, useEffect, lazy, Suspense } from 'react';
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
const FormsAdmin = lazy(() => import(/* webpackChunkName: "form" */ 'pages/FormsAdministration'));
const GroupAdmin = lazy(() => import(/* webpackChunkName: "group_admin" */ 'pages/GroupAdmin'));
const Http404 = lazy(() => import(/* webpackChunkName: "http404" */ 'pages/Http404'));
const JobPostAdministration = lazy(() => import(/* webpackChunkName: "jobpost_administration" */ 'pages/JobPostAdministration'));
const LogIn = lazy(() => import(/* webpackChunkName: "login" */ 'pages/LogIn'));
const NewsAdministration = lazy(() => import(/* webpackChunkName: "news_administration" */ 'pages/NewsAdministration'));
const Pages = lazy(() => import(/* webpackChunkName: "pages" */ 'pages/Pages'));
const ShortLinks = lazy(() => import(/* webpackChunkName: "short_links" */ 'pages/ShortLinks'));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ 'pages/SignUp'));
const UserAdmin = lazy(() => import(/* webpackChunkName: "user_admin" */ 'pages/UserAdmin'));
const StrikeAdmin = lazy(() => import(/* webpackChunkName: "strike_admin" */ 'pages/StrikeAdmin'));

type AuthRouteProps = {
  apps?: Array<PermissionApp>;
  element: ReactElement;
};

const AuthRoute = ({ apps = [], element }: AuthRouteProps) => {
  const setLogInRedirectURL = useSetRedirectUrl();
  const isAuthenticated = useIsAuthenticated();
  const { allowAccess, isLoading } = useHavePermission(apps);

  if (isLoading) {
    return <Page />;
  } else if (!isAuthenticated) {
    setLogInRedirectURL(window.location.pathname);
    return <Navigate to={URLS.login} />;
  } else if (allowAccess || !apps.length) {
    return element;
  }
  return <Navigate to={URLS.landing} />;
};

const AppRoutes = () => {
  const location = useLocation();
  const { event } = useGoogleAnalytics();

  useEffect(() => event('page_view', window.location.href, window.location.pathname), [location]);

  return (
    <Suspense fallback={<Page options={{ title: 'Laster...', filledTopbar: true }} />}>
      <Routes>
        <Route element={<Landing />} index />
        <Route element={<NewStudent />} path={URLS.newStudent} />
        <Route path={URLS.events}>
          <Route element={<AuthRoute apps={[PermissionApp.EVENT]} element={<EventRegistration />} />} path={`:id/${URLS.eventRegister}`} />
          <Route element={<EventDetails />} path=':id/*' />
          <Route element={<Events />} index />
        </Route>
        <Route element={<Companies />} path={URLS.company} />
        <Route element={<AuthRoute element={<Form />} />} path={`${URLS.form}:id/`} />
        <Route path={URLS.groups}>
          <Route element={<GroupAdmin />} path=':slug/*' />
          <Route element={<GroupOverview />} index />
        </Route>
        <Route path={URLS.jobposts}>
          <Route element={<JobPostDetails />} path=':id/*' />
          <Route element={<JobPosts />} index />
        </Route>
        <Route element={<Pages />} path={`${URLS.pages}*`} />
        <Route path={URLS.news}>
          <Route element={<NewsDetails />} path=':id/*' />
          <Route element={<News />} index />
        </Route>

        <Route element={<AuthRoute element={<Profile />} />} path={URLS.profile} />

        <Route element={<AuthRoute element={<Cheatsheet />} />} path={`${URLS.cheatsheet}:studyId/:classId/`} />
        <Route element={<AuthRoute element={<Cheatsheet />} />} path={`${URLS.cheatsheet}*`} />
        <Route element={<AuthRoute element={<ShortLinks />} />} path={URLS.shortLinks} />

        <Route element={<AuthRoute apps={[PermissionApp.JOBPOST]} element={<JobPostAdministration />} />} path={URLS.jobpostsAdmin}>
          <Route element={<JobPostAdministration />} path=':jobPostId/' />
        </Route>
        <Route element={<AuthRoute apps={[PermissionApp.EVENT]} element={<EventAdministration />} />} path={URLS.eventAdmin}>
          <Route element={<EventAdministration />} path=':eventId/' />
        </Route>
        <Route element={<AuthRoute apps={[PermissionApp.NEWS]} element={<NewsAdministration />} />} path={URLS.newsAdmin}>
          <Route element={<NewsAdministration />} path=':newsId/' />
        </Route>
        <Route element={<AuthRoute apps={[PermissionApp.USER]} element={<UserAdmin />} />} path={URLS.userAdmin} />
        <Route element={<AuthRoute apps={[PermissionApp.STRIKE]} element={<StrikeAdmin />} />} path={URLS.strikeAdmin} />
        <Route element={<AuthRoute apps={[PermissionApp.GROUP]} element={<FormsAdmin />} />} path={`${URLS.groupAdmin}:slug/`} />

        <Route element={<LogIn />} path={URLS.login} />
        <Route element={<ForgotPassword />} path={URLS.forgotPassword} />
        <Route element={<SignUp />} path={URLS.signup} />

        <Route element={<Http404 />} path='*' />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
