
import { authClientWithRedirect, userHasWriteAllPermission } from '~/api/auth';
import { type Route } from './+types';
import { PermissionApp } from '~/types/Enums';
import { redirect } from 'react-router';
import { href } from 'react-router';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const auth = await authClientWithRedirect(request);

    if (!userHasWriteAllPermission(auth.permissions, PermissionApp.ORDER)) {
        return redirect(href('/'));
    }
};

export default function EventPaymentOrders() {
    return (
        <div>

        </div>
    );
};