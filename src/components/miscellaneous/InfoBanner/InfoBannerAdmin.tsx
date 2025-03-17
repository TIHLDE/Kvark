import { zodResolver } from '@hookform/resolvers/zod';
import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { PaginateButton } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { useInfoBanners } from '~/hooks/InfoBanner';
import { PermissionApp } from '~/types/Enums';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { href, redirect } from 'react-router';
import { z } from 'zod';

import type { Route } from './+types/InfoBannerAdmin';
import InfoBannerItem, { InfoBannerForm } from './InfoBannerAdminItem';

type Filters = {
  is_visible: boolean;
  is_expired: boolean;
};

const formSchema = z.object({
  is_visible: z.boolean(),
  is_expired: z.boolean(),
});

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.BANNERS)) {
    return redirect(href('/'));
  }
}

function InfoBannerAdmin() {
  const [filters, setFilters] = useState<Filters>({ is_visible: false, is_expired: false });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { is_visible: false, is_expired: false },
  });

  const searchWithFilters = (values: z.infer<typeof formSchema>) => {
    setFilters({ is_visible: values.is_visible, is_expired: values.is_expired });
  };
  const { data: bannerData, hasNextPage, fetchNextPage, isFetching } = useInfoBanners(filters);
  const banners = useMemo(() => (bannerData ? bannerData.pages.flatMap((page) => page.results) : []), [bannerData]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Form {...form}>
          <form className='flex items-center space-x-4' onChange={form.handleSubmit(searchWithFilters)}>
            <FormField
              control={form.control}
              name='is_visible'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex space-x-2 items-center'>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <Label>Se aktive</Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='is_expired'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex space-x-2 items-center'>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <Label>Se tidligere</Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

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
