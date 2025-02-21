import { useRedirectUrl } from '~/hooks/Misc';
import { useHavePermission, useIsAuthenticated } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { type ReactElement, Suspense, useEffect } from 'react';
import { Navigate, Routes, useLocation } from 'react-router';

type AuthRouteProps = {
  /** List of permissions where the user must have access through at least one of them to be given access */
  apps?: Array<PermissionApp>;
  /** The element to render if have permission */
  element: ReactElement;
};

/**
 * Protects a route with permission checks. If `apps` is empty or not present, all authenticated users are given access.
 */
export const AuthRoute = ({ apps = [], element }: AuthRouteProps) => {
  const [, setLogInRedirectURL] = useRedirectUrl();
  const isAuthenticated = useIsAuthenticated();
  const { allowAccess, isLoading } = useHavePermission(apps, { enabled: Boolean(apps.length) });

  if (!isAuthenticated) {
    setLogInRedirectURL(window.location.pathname);
    return <Navigate to={URLS.login} />;
  }
  if (!apps.length) {
    return element;
  }
  if (isLoading) {
    return <div className='w-full min-h-screen' />;
  }
  if (allowAccess) {
    return element;
  }
  return <Navigate to={URLS.landing} />;
};

const AppRoutes = () => {
  const location = useLocation();
  const { event } = useAnalytics();

  useEffect(() => event('page_view', window.location.href, window.location.pathname), [location]);

  return (
    <Suspense fallback={<div className='w-full min-h-screen' />}>
      <Routes>
        {/* <Route element={<Landing />} index /> */}
        {/* <Route element={<NewStudent />} path={URLS.newStudent} /> */}
        {/* <Route element={<AuthRoute element={<Feedback />} />} path={URLS.feedback} /> */}
        {/* <Route path={URLS.events}> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.EVENT]} element={<EventRegistration />} />} path={`:id/${URLS.eventRegister}`} /> */}
        {/* <Route element={<EventDetails />} path=':id/*' /> */}
        {/* <Route element={<Events />} index /> */}
        {/* </Route> */}
        {/* <Route element={<Companies />} path={URLS.company} /> */}
        {/* <Route element={<Toddel />} path={URLS.toddel} /> */}
        {/* <Route path={URLS.form}> */}
        {/* <Route element={<AuthRoute element={<Form />} />} path={`:id/`} /> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.GROUPFORM]} element={<FormAdmin />} />} path={`admin/:id/`} /> */}
        {/* </Route> */}
        {/* <Route element={<Groups />} path={`${URLS.groups.index}*`}> */}
        {/* <Route element={<GroupsOverview />} index /> */}
        {/* <Route element={<GroupDetails />} path=':slug/*' /> */}
        {/* </Route> */}
        {/* <Route path={`${URLS.badges.index}`}> */}
        {/* <Route element={<Badges />} path='*'> */}
        {/* <Route element={<BadgesOverallLeaderboard />} index /> */}
        {/* <Route element={<BadgeCategoriesList />} path={URLS.badges.category_relative} /> */}
        {/* <Route element={<BadgesList />} path={URLS.badges.public_badges_relative} /> */}
        {/* <Route path={URLS.badges.get_badge_relative}> */}
        {/* <Route element={<AuthRoute element={<BadgesGet />} />} index /> */}
        {/* <Route element={<AuthRoute element={<BadgesGet />} />} path=':badgeId' /> */}
        {/* </Route> */}
        {/* </Route> */}
        {/* <Route element={<BadgeCategory />} path={`${URLS.badges.category_relative}:categoryId/*`}> */}
        {/* <Route element={<BadgesCategoryLeaderboard />} index /> */}
        {/* <Route element={<BadgesList />} path={URLS.badges.category_badges_relative} /> */}
        {/* </Route> */}
        {/* <Route element={<BadgeDetails />} path=':badgeId/' /> */}
        {/* </Route> */}
        {/* <Route path={URLS.jobposts}> */}
        {/* <Route element={<JobPostDetails />} path=':id/*' /> */}
        {/* <Route element={<JobPosts />} index /> */}
        {/* </Route> */}
        {/* <Route path={URLS.gallery}> */}
        {/* <Route element={<GalleryDetails />} path=':id/*' /> */}
        {/* <Route element={<Gallery />} index /> */}
        {/* </Route> */}
        {/* <Route element={<Wiki />} path={`/wiki/*`} /> */}
        {/* <Route path={URLS.news}> */}
        {/* <Route element={<NewsDetails />} path=':id/*' /> */}
        {/* <Route element={<News />} index /> */}
        {/* </Route> */}

        {/* TODO: Find out if this page is in use */}
        {/* <Route element={<SlackConnectPage />} path='slack/' /> */}
        {/* <Route element={<AuthRoute element={<Profile />} />} path={URLS.profile}> */}
        {/* <Route element={<Profile />} path=':userId/' /> */}
        {/* </Route> */}

        {/* <Route element={<AuthRoute element={<Cheatsheet />} />} path={`${URLS.cheatsheet}:studyId/:classId/`} /> */}
        {/* <Route element={<AuthRoute element={<Cheatsheet />} />} path={`${URLS.cheatsheet}*`} /> */}
        {/* <Route element={<AuthRoute element={<ShortLinks />} />} path={URLS.shortLinks} /> */}
        {/* <Route element={<AuthRoute element={<QRCodes />} />} path={URLS.qrCodes} /> */}
        {/* <Route element={<AuthRoute element={<Admissions />} />} path={URLS.admissions} /> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.BANNERS]} element={<InfoBannerAdmin />} />} path={URLS.bannerAdmin}> */}
        {/* <Route element={<InfoBannerAdmin />} /> */}
        {/* </Route> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.GROUP]} element={<NewGroupAdministration />} />} path={URLS.newGroupAdmin} /> */}

        {/* <Route element={<AuthRoute apps={[PermissionApp.JOBPOST]} element={<JobPostAdministration />} />} path={URLS.jobpostsAdmin}> */}
        {/* <Route element={<JobPostAdministration />} path=':jobPostId/' /> */}
        {/* </Route> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.EVENT]} element={<EventAdministration />} />} path={URLS.eventAdmin}> */}
        {/* <Route element={<EventAdministration />} path=':eventId/' /> */}
        {/* </Route> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.NEWS]} element={<NewsAdministration />} />} path={URLS.newsAdmin}> */}
        {/* <Route element={<NewsAdministration />} path=':newsId/' /> */}
        {/* </Route> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.USER]} element={<UserAdmin />} />} path={URLS.userAdmin} /> */}
        {/* <Route element={<AuthRoute apps={[PermissionApp.STRIKE]} element={<StrikeAdmin />} />} path={URLS.strikeAdmin} /> */}

        {/* <Route element={<LogIn />} path={URLS.login} /> */}
        {/* <Route element={<ForgotPassword />} path={URLS.forgotPassword} /> */}
        {/* <Route element={<SignUp />} path={URLS.signupForm} /> */}
        {/* <Route element={<SignUpOptions />} path={URLS.signup} /> */}
        {/* <Route element={<SignUpFeide />} path={URLS.signupFeide} /> */}

        {/* <Route element={<Changelog />} path={URLS.changelog} /> */}

        {/* <Route element={<Http404 />} path='*' /> */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
