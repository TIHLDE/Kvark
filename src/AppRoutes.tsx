import { PLAUSIBLE_DOMAIN } from 'constant';
import Plausible from 'plausible-tracker';
import { lazy, ReactElement, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import URLS from 'URLS';

import { PermissionApp } from 'types/Enums';

import { useSetRedirectUrl } from 'hooks/Misc';
import { useHavePermission, useIsAuthenticated } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import Companies from 'pages/Companies';
import EventDetails from 'pages/EventDetails';
import Events from 'pages/Events';
import Groups from 'pages/Groups';
import GroupDetails from 'pages/Groups/GroupDetails';
import GroupsOverview from 'pages/Groups/overview';
import JobPostDetails from 'pages/JobPostDetails';
import JobPosts from 'pages/JobPosts';
import Landing from 'pages/Landing';
import News from 'pages/News';
import NewsDetails from 'pages/NewsDetails';
import NewStudent from 'pages/NewStudent';
import Profile from 'pages/Profile';

import Page from 'components/navigation/Page';

const Gallery = lazy(() => import(/* webpackChunkName: "gallery" */ 'pages/Gallery'));
const GalleryDetails = lazy(() => import(/* webpackChunkName: "gallery_details" */ 'pages/GalleryDetails'));
const Badges = lazy(() => import('pages/Badges'));
const BadgeCategoriesList = lazy(() => import('pages/Badges/overview/BadgeCategoriesList'));
const BadgesList = lazy(() => import('pages/Badges/overview/BadgesList'));
const BadgesOverallLeaderboard = lazy(() => import('pages/Badges/overview/BadgesOverallLeaderboard'));
const BadgeDetails = lazy(() => import('pages/Badges/details'));
const BadgeCategory = lazy(() => import('pages/Badges/category'));
const BadgesGet = lazy(() => import('pages/Badges/get'));
const BadgesCategoryLeaderboard = lazy(() => import('pages/Badges/category/BadgesCategoryLeaderboard'));
const Cheatsheet = lazy(() => import(/* webpackChunkName: "cheatsheet" */ 'pages/Cheatsheet'));
const EventAdministration = lazy(() => import(/* webpackChunkName: "event_administration" */ 'pages/EventAdministration'));
const EventRegistration = lazy(() => import(/* webpackChunkName: "event_registration" */ 'pages/EventRegistration'));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot_password" */ 'pages/ForgotPassword'));
const Form = lazy(() => import(/* webpackChunkName: "form" */ 'pages/Form'));
const Http404 = lazy(() => import(/* webpackChunkName: "http404" */ 'pages/Http404'));
const JobPostAdministration = lazy(() => import(/* webpackChunkName: "jobpost_administration" */ 'pages/JobPostAdministration'));
const LogIn = lazy(() => import(/* webpackChunkName: "login" */ 'pages/LogIn'));
const NewsAdministration = lazy(() => import(/* webpackChunkName: "news_administration" */ 'pages/NewsAdministration'));
const Wiki = lazy(() => import(/* webpackChunkName: "pages" */ 'pages/Wiki'));
const ShortLinks = lazy(() => import(/* webpackChunkName: "short_links" */ 'pages/ShortLinks'));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ 'pages/SignUp'));
const StrikeAdmin = lazy(() => import(/* webpackChunkName: "strike_admin" */ 'pages/StrikeAdmin'));
const UserAdmin = lazy(() => import(/* webpackChunkName: "user_admin" */ 'pages/UserAdmin'));

type AuthRouteProps = {
  apps?: Array<PermissionApp>;
  element: ReactElement;
};

export const AuthRoute = ({ apps = [], element }: AuthRouteProps) => {
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
  const { event } = useAnalytics();

  useEffect(() => event('page_view', window.location.href, window.location.pathname), [location]);

  useEffect(() => {
    const { enableAutoPageviews, enableAutoOutboundTracking } = Plausible({ domain: PLAUSIBLE_DOMAIN });
    const cleanupPageViews = enableAutoPageviews();
    const cleanupOutboundTracking = enableAutoOutboundTracking();

    return () => {
      cleanupPageViews();
      cleanupOutboundTracking();
    };
  }, []);

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
        <Route element={<Groups />} path={`${URLS.groups.index}*`}>
          <Route element={<GroupsOverview />} index />
          <Route element={<GroupDetails />} path=':slug/*' />
        </Route>
        <Route path={`${URLS.badges.index}`}>
          <Route element={<Badges />} path='*'>
            <Route element={<BadgesOverallLeaderboard />} index />
            <Route element={<BadgeCategoriesList />} path={URLS.badges.category_relative} />
            <Route element={<BadgesList />} path={URLS.badges.public_badges_relative} />
            <Route element={<BadgesGet />} path={URLS.badges.get_badge_relative} />
          </Route>
          <Route element={<BadgeCategory />} path={`${URLS.badges.category_relative}:categoryId/*`}>
            <Route element={<BadgesCategoryLeaderboard />} index />
            <Route element={<BadgesList />} path={URLS.badges.category_badges_relative} />
          </Route>
          <Route element={<BadgeDetails />} path=':badgeId/' />
        </Route>
        <Route path={URLS.jobposts}>
          <Route element={<JobPostDetails />} path=':id/*' />
          <Route element={<JobPosts />} index />
        </Route>
        <Route path={URLS.gallery}>
          <Route element={<GalleryDetails />} path=':slug/*' />
          <Route element={<Gallery />} index />
        </Route>
        <Route element={<Wiki />} path={`${URLS.wiki}*`} />
        <Route path={URLS.news}>
          <Route element={<NewsDetails />} path=':id/*' />
          <Route element={<News />} index />
        </Route>

        <Route element={<AuthRoute element={<Profile />} />} path={URLS.profile}>
          <Route element={<Profile />} path=':userId/' />
        </Route>

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

        <Route element={<LogIn />} path={URLS.login} />
        <Route element={<ForgotPassword />} path={URLS.forgotPassword} />
        <Route element={<SignUp />} path={URLS.signup} />

        <Route element={<Http404 />} path='*' />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
