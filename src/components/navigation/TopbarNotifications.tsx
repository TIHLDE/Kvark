import NotFoundIndicator from '~/components/miscellaneous/NotFoundIndicator';
import { Button, PaginateButton } from '~/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '~/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import { useNotifications } from '~/hooks/Notification';
import { useUser } from '~/hooks/User';
import type { Notification } from '~/types';
import { getTimeSince } from '~/utils';
import { parseISO } from 'date-fns';
import { Bell, BellRing, SquareArrowOutUpRight, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

type NotificationItemProps = {
  notification: Notification;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NotificationsTopbarProps = {
  color: React.CSSProperties['backgroundColor'];
};

const NotificationItem = ({ notification, setShowNotifications }: NotificationItemProps) => {
  const [showDescription, setShowDescription] = useState(false);

  const linkOnClick = () => {
    setShowNotifications(false);
  };

  return (
    <div className='w-full flex justify-between px-4 py-4 border-b'>
      <div className='w-5/6 space-y-2'>
        <div>
          <h1 className='text-sm truncate'>{notification.title}</h1>
          <p className='text-xs text-muted-foreground'>{getTimeSince(parseISO(notification.created_at))}</p>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>
            {notification.description.length < 100 ? (
              notification.description
            ) : (
              <p>
                {showDescription ? notification.description : `${notification.description.slice(0, 100)}...`}
                <span className='text-primary hover:underline cursor-pointer ml-1 text-xs' onClick={() => setShowDescription((prev) => !prev)}>
                  {showDescription ? 'Skjul' : 'Vis mer'}
                </span>
              </p>
            )}
          </div>
        </div>
        {notification.link && (
          <Button asChild className='w-auto h-auto px-4 py-2' variant='secondary'>
            <Link className='text-xs' onClick={linkOnClick} to={notification.link}>
              <SquareArrowOutUpRight className='h-[1rem] w-[1rem] stroke-[1.5px] mr-2' />
              Les mer
            </Link>
          </Button>
        )}
      </div>

      {!notification.read && <div className='rounded-full w-2 h-2 bg-sky-300 animate-pulse' />}
    </div>
  );
};

const NotificationItemLoading = () => (
  <div className='space-y-2'>
    {[...Array(6)].map((_, index) => (
      <Skeleton className='h-12' key={index} />
    ))}
  </div>
);

const NotificationsTopbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: user } = useUser();
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNotifications(showNotifications);
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
  const notifications = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  if (!isDesktop) {
    return (
      <Drawer onOpenChange={setShowNotifications} open={showNotifications}>
        <DrawerTrigger asChild>
          <button className='dark:text-white'>
            {!showNotifications ? (
              user && user.unread_notifications > 0 ? (
                <div className='relative'>
                  <BellRing className='h-[1.2rem] w-[1.2rem]' />
                  <div className='absolute bottom-0 -right-0.5 bg-red-400 rounded-full h-2 w-2 animate-pulse' />
                </div>
              ) : (
                <Bell className='h-[1.2rem] w-[1.2rem]' />
              )
            ) : (
              <X className='h-[1.2rem] w-[1.2rem]' />
            )}
          </button>
        </DrawerTrigger>

        <DrawerContent className='px-2'>
          <h1 className='text-xl font-bold text-center pt-4 pb-2'>Varslinger</h1>

          <ScrollArea className='h-[60vh] pb-4 pr-0'>
            {isLoading && <NotificationItemLoading />}
            {isEmpty && <NotFoundIndicator header='Fant ingen varsler' />}
            {error && <h1 className='text-center mt-8'>{error.detail}</h1>}
            {data !== undefined && (
              <div>
                {notifications.map((notification, index) => (
                  <NotificationItem key={index} notification={notification} setShowNotifications={setShowNotifications} />
                ))}
              </div>
            )}
            {hasNextPage && <PaginateButton className='w-full mt-4 bg-inherit' isLoading={isFetching} nextPage={fetchNextPage} />}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover onOpenChange={setShowNotifications} open={showNotifications}>
      <PopoverTrigger asChild>
        <button className='dark:text-white'>
          {!showNotifications ? (
            user && user.unread_notifications > 0 ? (
              <div className='relative'>
                <BellRing className='h-[1.2rem] w-[1.2rem]' />
                <div className='absolute bottom-0 -right-0.5 bg-red-400 rounded-full h-2 w-2 animate-pulse' />
              </div>
            ) : (
              <Bell className='h-[1.2rem] w-[1.2rem]' />
            )
          ) : (
            <X className='h-[1.2rem] w-[1.2rem]' />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] rounded-xl mr-8 mt-2 p-0 dark:bg-background'>
        <div className='p-4'>
          <h1 className='text-lg font-bold'>Varslinger</h1>
        </div>

        <Separator />

        <ScrollArea className='h-[60vh] pb-4 pr-0'>
          {isLoading && <NotificationItemLoading />}
          {isEmpty && <NotFoundIndicator header='Fant ingen varsler' />}
          {error && <h1 className='text-center mt-8'>{error.detail}</h1>}
          {data !== undefined && (
            <div>
              {notifications.map((notification, index) => (
                <NotificationItem key={index} notification={notification} setShowNotifications={setShowNotifications} />
              ))}
            </div>
          )}
          {hasNextPage && <PaginateButton className='w-full mt-4 bg-inherit' isLoading={isFetching} nextPage={fetchNextPage} />}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsTopbar;
