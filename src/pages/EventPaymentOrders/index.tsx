import { authClientWithRedirect, userHasWriteAllPermission } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { usePaymentOrders } from '~/hooks/Payment';
import { PermissionApp } from '~/types/Enums';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { redirect } from 'react-router';
import { href } from 'react-router';

import OrderListItem from './_components/OrderItem';
import { type Route } from './+types';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWriteAllPermission(auth.permissions, PermissionApp.ORDER)) {
    return redirect(href('/'));
  }
}

export default function EventPaymentOrders() {
  const { data, error, isLoading } = usePaymentOrders();

  const orders = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  if (isLoading) {
    return (
      <Page className='h-screen flex items-center justify-center'>
        <Loader2 className='w-16 h-16 animate-spin' />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div className='bg-card rounded-lg border shadow-sm p-12 flex justify-center'>
          <div className='space-y-12'>
            <AlertTriangle className='w-20 h-20 mx-auto text-destructive' />

            <div className='space-y-6 text-center'>
              <h1 className='text-xl md:text-3xl font-bold'>Ops! Noe gikk galt.</h1>
              <p>{error.detail}</p>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page className='max-w-4xl mx-auto'>
      <div>
        <div className='space-y-4 w-full'>
          {orders.map((order, index) => (
            <OrderListItem key={index} order={order} />
          ))}
        </div>
      </div>
    </Page>
  );
}
