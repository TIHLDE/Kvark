import parseISO from 'date-fns/parseISO';
import { Bell, BellRing, ChevronDown, ChevronUp, SquareArrowOutUpRight, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTimeSince } from 'utils';

import { Notification } from 'types';

import useMediaQuery, { MEDIUM_SCREEN } from 'hooks/MediaQuery';
import { useNotifications } from 'hooks/Notification';
import { useUser } from 'hooks/User';

import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import { Button, PaginateButton } from 'components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { Drawer, DrawerContent, DrawerTrigger } from 'components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { ScrollArea } from 'components/ui/scroll-area';
import { Skeleton } from 'components/ui/skeleton';

type NotificationItemProps = {
  notification: Notification;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NotificationsTopbarProps = {
  color: React.CSSProperties['backgroundColor'];
};

const NotificationItem = ({ notification, setShowNotifications }: NotificationItemProps) => {
  const [showDescription, setShowDescription] = useState(false);

  const Icon = notification.read ? Bell : BellRing;
  const ExpandIcon = showDescription ? ChevronUp : ChevronDown;

  const linkOnClick = () => {
    setShowNotifications(false);
  };

  return (
    <Collapsible className='rounded-md border bg-inherit' onOpenChange={setShowDescription} open={showDescription}>
      <div className='w-full'>
        <CollapsibleTrigger className='flex items-center justify-between w-full hover:bg-border py-2 px-4 rounded-tl-sm cursor-pointer'>
          <div className='flex items-center space-x-6'>
            <Icon className='h-[1.2rem] w-[1.2rem] stroke-[1.5px]' />
            <div className='text-start'>
              <h1 className='text-sm'>{notification.title}</h1>
              <p className='text-xs text-muted-foreground'>{getTimeSince(parseISO(notification.created_at))}</p>
            </div>
          </div>
          <ExpandIcon className='w-5 h-5 stroke-[1.5px]' />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <p className='text-sm border-t p-2'>{notification.description}</p>
        {notification.link && (
          <Button asChild className='w-full rounded-t-none' variant='secondary'>
            <Link onClick={linkOnClick} to={notification.link}>
              <SquareArrowOutUpRight className='h-[1.2rem] w-[1.2rem] stroke-[1.5px] mr-2' />
              Les mer
            </Link>
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
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
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNotifications({ enabled: showNotifications });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
  const notifications = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  if (!isDesktop) {
    return (
      <Drawer onOpenChange={setShowNotifications} open={showNotifications}>
        <DrawerTrigger asChild>
          <Button className='dark:text-white' size='icon' variant='ghost'>
            {!showNotifications ? (
              user && user.unread_notifications > 0 ? (
                <BellRing className='animate-pulse w-[1.2rem] h-[1.2rem] stroke-[1.5px]' />
              ) : (
                <Bell className='w-[1.2rem] h-[1.2rem] stroke-[1.5px]' />
              )
            ) : (
              <X />
            )}
          </Button>
        </DrawerTrigger>

        <DrawerContent className='px-2'>
          <h1 className='text-xl font-bold text-center'>Varslinger</h1>

          <ScrollArea className='h-[60vh]'>
            {isLoading && <NotificationItemLoading />}
            {isEmpty && <NotFoundIndicator header='Fant ingen varsler' />}
            {error && <h1 className='text-center mt-8'>{error.detail}</h1>}
            {data !== undefined && (
              <div className='space-y-2'>
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
        <Button className='dark:text-white' size='icon' variant='ghost'>
          {!showNotifications ? (
            user && user.unread_notifications > 0 ? (
              <BellRing className='animate-pulse h-[1.2rem] w-[1.2rem]' />
            ) : (
              <Bell className='h-[1.2rem] w-[1.2rem]' />
            )
          ) : (
            <X className='h-[1.2rem] w-[1.2rem]' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[600px]'>
        <h1 className='text-xl font-bold text-center'>Varslinger</h1>

        <ScrollArea className='h-[60vh]'>
          {isLoading && <NotificationItemLoading />}
          {isEmpty && <NotFoundIndicator header='Fant ingen varsler' />}
          {error && <h1 className='text-center mt-8'>{error.detail}</h1>}
          {data !== undefined && (
            <div className='space-y-2'>
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
