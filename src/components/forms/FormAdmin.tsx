import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { Form } from 'types';

import { useFormById } from 'hooks/Form';

import FormAnswers from 'components/forms/FormAnswers';
import FormDetailsEditor from 'components/forms/FormDetailsEditor';
import FormFieldsEditor from 'components/forms/FormFieldsEditor';
import FormStatistics from 'components/forms/FormStatistics';

export type FormAdminProps = {
  formId: Form['id'];
};

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div aria-labelledby={`full-width-tab-${index}`} hidden={value !== index} id={`full-width-tabpanel-${index}`} role='tabpanel' {...other}>
      {value === index && (
        <Box sx={{ py: 3, px: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const FormAdmin = ({ formId }: FormAdminProps) => {
  const { data: form } = useFormById(formId);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!form) {
    return null;
  }

  return (
    <div>
      <Tabs
        aria-label='full width tabs example'
        indicatorColor='secondary'
        onChange={handleChange}
        scrollButtons
        textColor='inherit'
        value={value}
        variant='scrollable'>
        <Tab label='Innstillinger' {...a11yProps(0)} />
        <Tab label='Spørsmål' {...a11yProps(1)} />
        <Tab label='Statestikk' {...a11yProps(2)} />
        <Tab label='Alle svar' {...a11yProps(3)} />
      </Tabs>
      <>
        <TabPanel index={0} value={value}>
          <FormDetailsEditor form={form} />
        </TabPanel>
        <TabPanel index={1} value={value}>
          <FormFieldsEditor form={form} />
        </TabPanel>
        <TabPanel index={2} value={value}>
          <FormStatistics formId={form.id} />
        </TabPanel>
        <TabPanel index={3} value={value}>
          <FormAnswers formId={form.id} />
        </TabPanel>
      </>
    </div>
  );
};

export default FormAdmin;
