import CategoryIcon from '@mui/icons-material/CategoryRounded';
import DateIcon from '@mui/icons-material/DateRangeRounded';
import { alpha, Button, ButtonProps, Grid, ListItemProps, Skeleton, Stack, styled, SvgIconTypeMap, Typography, useTheme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import useDimensions from 'react-cool-dimensions';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, urlEncode } from 'utils';

import { EventList } from 'types';
import { Category, Groups } from 'types/Enums';

import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

type EventInfoContentProps = {
  icon?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  label: string;
  fontSize?: number;
};

const EventInfoContent = ({ icon: Icon, label, fontSize }: EventInfoContentProps) => (
  <Grid alignItems='center' container direction='row' wrap='nowrap'>
    {Icon && <Icon sx={{ m: 0, mr: 1, width: 20, height: 20 }} />}
    <Typography
      sx={{ fontSize: fontSize || 14, textTransform: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
      variant='subtitle1'>
      {label}
    </Typography>
  </Grid>
);

export type EventListItemProps = {
  event: EventList;
  sx?: ListItemProps['sx'];
};

const EventListItemButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'borderColor' })<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ButtonProps<any, { component?: any }> & { borderColor: string }
>(({ theme, borderColor }) => ({
  display: 'block',
  margin: 'auto',
  height: 'fit-content',
  width: '100%',
  color: borderColor,
  borderColor: alpha(borderColor, 0.5),
  borderRadius: theme.shape.borderRadius,
  padding: 2,
  borderWidth: 2,
  '&:hover': {
    borderColor: borderColor,
    borderWidth: 2,
  },
}));

const EventListItemInner = styled('div', { shouldForwardProp: (prop) => prop !== 'height' })<{ height: number }>(({ theme, height }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: `${(height / 9) * 21}px auto 1fr`,
  height,
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(0.5),
  },
  borderRadius: Number(theme.shape.borderRadius) - Number(theme.shape.borderRadius) / 4,
  background: theme.palette.background.paper,
  overflow: 'hidden',
  color: theme.palette.text.primary,
}));

const Divider = styled('div')(({ theme }) => ({
  borderRadius: 3,
  margin: theme.spacing(0.25, 0),
  width: theme.spacing(0.75),
}));

const EventListItem = ({ event, sx }: EventListItemProps) => {
  const { observe, width } = useDimensions();
  const theme = useTheme();

  const [height, titleFontSize, contentFontSize] = useMemo(() => {
    if (width < 400) {
      return [68, 18, 13];
    } else if (width < 500) {
      return [75, 19, 14];
    } else if (width < 700) {
      return [90, 20, 15];
    }
    return [110, 22, 17];
  }, [width]);

  const categoryLabel = `${event.organizer ? `${event.organizer.name} | ` : ''}${event.category?.text || 'Laster...'}`;

  const getColor = () => {
    if (event.category?.text === Category.ACTIVITY) {
      return theme.palette.colors.activity_event;
    }

    if (
      event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ||
      event.category?.text.toLowerCase() === Category.COMPRES ||
      event.category?.text.toLowerCase() === Category.COURSE
    ) {
      return theme.palette.colors.nok_event;
    }

    return theme.palette.colors.other_event;
  };

  return (
    <EventListItemButton
      borderColor={getColor()}
      component={Link}
      ref={observe}
      sx={sx}
      to={`${URLS.events}${event.id}/${urlEncode(event.title)}/`}
      variant='outlined'>
      <EventListItemInner height={height}>
        <AspectRatioImg alt={event.image_alt || event.title} src={event.image} />
        <Divider sx={{ backgroundColor: getColor() }} />
        <Stack justifyContent='center' sx={{ overflow: 'hidden', pr: 0.5 }}>
          <Typography
            sx={{
              fontSize: titleFontSize,
              color: (theme) => theme.palette.text.primary,
              textTransform: 'none',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            variant='h2'>
            {event.title}
          </Typography>
          <EventInfoContent fontSize={contentFontSize} icon={DateIcon} label={formatDate(parseISO(event.start_date))} />
          {width > 500 && <EventInfoContent fontSize={contentFontSize} icon={CategoryIcon} label={categoryLabel} />}
        </Stack>
      </EventListItemInner>
    </EventListItemButton>
  );
};

export default EventListItem;

export const EventListItemLoading = ({ sx }: Pick<EventListItemProps, 'sx'>) => {
  const { observe, width } = useDimensions();
  const theme = useTheme();

  const [height, titleFontSize, contentFontSize] = useMemo(() => {
    if (width < 400) {
      return [68, 36, 26];
    } else if (width < 500) {
      return [75, 38, 28];
    } else if (width < 700) {
      return [90, 40, 30];
    }
    return [110, 44, 34];
  }, [width]);

  return (
    <EventListItemButton borderColor={theme.palette.divider} ref={observe} sx={sx} variant='outlined'>
      <EventListItemInner height={height}>
        <AspectRatioLoading sx={{ borderRadius: '0 !important' }} />
        <Divider sx={{ backgroundColor: theme.palette.divider }} />
        <Stack justifyContent='center' sx={{ overflow: 'hidden', pr: 0.5 }}>
          <Skeleton height={titleFontSize} width={250} />
          <Skeleton height={contentFontSize} width={300} />
          {width > 500 && <Skeleton height={contentFontSize} width={150} />}
        </Stack>
      </EventListItemInner>
    </EventListItemButton>
  );
};
