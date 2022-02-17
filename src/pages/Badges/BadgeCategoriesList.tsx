import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { useBadgeCategories } from 'hooks/Badge';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

export const BadgeCategoriesList = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useBadgeCategories();
  const badgeCategories = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      {/* {isLoading && <BadgeItemLoading />} */}
      {!isLoading && !badgeCategories && <NotFoundIndicator header='Fant ingen offentlige badges' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack component={List} gap={1}>
            {badgeCategories.map((badgeCategory) => (
              <ListItem component={Paper} disablePadding key={badgeCategory.id} noOverflow noPadding>
                <ListItemButton component={Link} to={URLS.badges.category_leaderboard(badgeCategory.id)}>
                  <ListItemIcon>
                    <AspectRatioImg
                      alt={badgeCategory.name}
                      ratio={1}
                      src={badgeCategory.image || ''}
                      sx={{ height: 100, borderRadius: (theme) => `${theme.shape.borderRadius}px`, mr: 1 }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={badgeCategory.name} secondary={badgeCategory.description} />
                </ListItemButton>
              </ListItem>
            ))}
          </Stack>
        </Pagination>
      )}
    </>
  );
};

export default BadgeCategoriesList;
