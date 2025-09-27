import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';
import { useInfoBanners } from '~/hooks/InfoBanner';
import { PermissionApp } from '~/types/Enums';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { href, redirect } from 'react-router';

import { Route } from './+types/InfoBannerAdmin';
import InfoBannerItem, { InfoBannerForm } from './InfoBannerAdminItem';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.BANNERS)) {
    return redirect(href('/'));
  }
}

function InfoBannerAdmin() {
  const [isVisible, setIsVisible] = useQueryState('visible', parseAsBoolean.withDefault(false));
  const [isExpired, setIsExpired] = useQueryState('expired', parseAsBoolean.withDefault(false));

  const filters = useMemo(() => ({ is_visible: isVisible, is_expired: isExpired }), [isVisible, isExpired]);

  const { data: bannerData, hasNextPage, fetchNextPage, isFetching } = useInfoBanners(filters);
  const banners = useMemo(() => (bannerData ? bannerData.pages.map((page) => page.results).flat() : []), [bannerData]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center gap-2'>
            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
            <span>Se aktive</span>
          </label>
          <label className='flex items-center gap-2'>
            <Switch checked={isExpired} onCheckedChange={setIsExpired} />
            <span>Se tidligere</span>
          </label>
        </div>

        <InfoBannerForm />
      </div>

      <div className='space-y-2'>
        {banners.map((banner, index) => (
          <InfoBannerItem banner={banner} key={index} />
        ))}
      </div>

      {hasNextPage && <PaginateButton className='w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
    </div>
  );
}

const CreateInfoBannerAdminDialog = () => {
  return (
    <Page className='max-w-5xl w-full mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Banner admin</CardTitle>
          <CardDescription>Bannere brukes for å gi en felles informasjon til alle som besøker nettsiden.</CardDescription>
        </CardHeader>
        <CardContent>
          <InfoBannerAdmin />
        </CardContent>
      </Card>
    </Page>
  );
};

export default CreateInfoBannerAdminDialog;
