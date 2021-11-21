// Material-UI
import { Select, FormControl, InputLabel, LinearProgress, MenuItem, Typography } from '@mui/material';
import FormEditor from 'components/forms/FormEditor';
import { useGroupForms } from 'hooks/GroupForms';
import { useCallback, useState } from 'react';
import { GroupForm } from 'types';

export type GroupFormAdminProps = {
  slug: string;
};

const GroupFormAdmin = ({ slug }: GroupFormAdminProps) => {
  const { data, isLoading, isError } = useGroupForms(slug);
  const [selectedForm, setSelectedForm] = useState<GroupForm | undefined>();

  const handleSelectChange = useCallback(
    (event) => {
      const form = data?.find((form: GroupForm) => form.id === event.target.value);
      setSelectedForm(form);
    },
    [setSelectedForm, data],
  );

  if (isLoading || !data) {
    return <LinearProgress />;
  }

  return (
    <div>
      <Typography variant='h3'>Alle skjemaer</Typography>
      <Typography variant='caption'>
        Deltagere som melder seg på dette arrangementet vil måtte svare på disse spørsmålene først. Deltagerne kan la være å svare på spørsmål som ikke er
        &quot;Påkrevd&quot;.
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Velg skjema</InputLabel>
        <Select label='Skjemaer' onChange={handleSelectChange} value='Form'>
          {data.map((value, index) => (
            <MenuItem key={index} value={value.id}>
              {value.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedForm !== undefined && <FormEditor form={selectedForm} />}
    </div>
  );
};

export default GroupFormAdmin;
