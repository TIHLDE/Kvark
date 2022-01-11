import { useMemo } from 'react';
import { RegistrationPriority } from 'types';
import { UserClass, UserStudy } from 'types/Enums';
import { getUserStudyShort } from 'utils';
import { Typography, Stack, styled } from '@mui/material';

const Item = styled(Typography)(({ theme }) => ({
  padding: '0 3px',
  border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  margin: 3,
  color: theme.palette.text.primary,
}));

export type EventPrioritesProps = {
  priorities: Array<RegistrationPriority>;
};

const EventPriorities = ({ priorities }: EventPrioritesProps) => {
  const prioritiesArray = useMemo(() => {
    const arr: Array<string> = [];
    [UserStudy.DATAING, UserStudy.DIGFOR, UserStudy.DIGSEC, UserStudy.DIGSAM, UserStudy.INFO].forEach((study: UserStudy) => {
      const classes_in_study = study === UserStudy.DIGSAM ? [UserClass.FOURTH, UserClass.FIFTH] : [UserClass.FIRST, UserClass.SECOND, UserClass.THIRD];
      const all_classes_in_study_prioritized = classes_in_study.every((user_class) =>
        priorities.some((item) => item.user_class === user_class && item.user_study === study),
      );
      if (all_classes_in_study_prioritized) {
        arr.push(getUserStudyShort(study));
      } else {
        priorities
          .filter((priority) => priority.user_study === study)
          .forEach((priority) => arr.push(`${priority.user_class}. ${getUserStudyShort(priority.user_study)}`));
      }
    });
    return arr;
  }, [priorities]);

  return (
    <Stack direction='row' flexWrap='wrap'>
      {prioritiesArray.map((priority, index) => (
        <Item key={index} variant='subtitle1'>
          {priority}
        </Item>
      ))}
    </Stack>
  );
};

export default EventPriorities;
