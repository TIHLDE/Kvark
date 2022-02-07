import { alpha, Stack, styled, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { getUserStudyShort } from 'utils';

import { RegistrationPriority } from 'types';
import { UserClass, UserStudy } from 'types/Enums';

import { useUser } from 'hooks/User';

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0, 0.75),
  border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  margin: 3,
  color: theme.palette.text.primary,
}));

export type EventPrioritesProps = {
  priorities: Array<RegistrationPriority>;
};

const EventPriorities = ({ priorities }: EventPrioritesProps) => {
  const { data: user } = useUser();
  const prioritiesArray = useMemo(() => {
    const arr: Array<{ label: string; member_of: boolean }> = [];
    [UserStudy.DATAING, UserStudy.DIGFOR, UserStudy.DIGSEC, UserStudy.DIGSAM, UserStudy.INFO].forEach((study: UserStudy) => {
      const classes_in_study = study === UserStudy.DIGSAM ? [UserClass.FOURTH, UserClass.FIFTH] : [UserClass.FIRST, UserClass.SECOND, UserClass.THIRD];
      const all_classes_in_study_prioritized = classes_in_study.every((user_class) =>
        priorities.some((item) => item.user_class === user_class && item.user_study === study),
      );
      if (all_classes_in_study_prioritized) {
        arr.push({
          label: getUserStudyShort(study),
          member_of: classes_in_study.some((user_class) => user_class === user?.user_class && study === user?.user_study),
        });
      } else {
        priorities
          .filter((priority) => priority.user_study === study)
          .forEach((priority) =>
            arr.push({
              label: `${priority.user_class}. ${getUserStudyShort(priority.user_study)}`,
              member_of: priority.user_class === user?.user_class && priority.user_study === user?.user_study,
            }),
          );
      }
    });
    return arr;
  }, [priorities, user]);

  return (
    <Stack direction='row' flexWrap='wrap'>
      {prioritiesArray.map((priority, index) =>
        priority.member_of ? (
          <Tooltip arrow key={index} title='Du er medlem av denne klassen/studiet og er dermed prioritert på dette arrangementet'>
            <Item sx={{ borderColor: (theme) => alpha(theme.palette.info.dark, 0.8) }} variant='subtitle1'>
              {priority.label}
            </Item>
          </Tooltip>
        ) : (
          <Item key={index} variant='subtitle1'>
            {priority.label}
          </Item>
        ),
      )}
    </Stack>
  );
};

export default EventPriorities;
