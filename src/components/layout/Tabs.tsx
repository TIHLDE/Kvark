import { ComponentType } from 'react';

// Material UI Components
import { Tabs as MuiTabs, Tab as MuiTab, styled } from '@material-ui/core';

const CustomTabs = styled(MuiTabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    height: 3,
  },
}));

const Tab = styled(MuiTab)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '0.9rem',
    minWidth: 92,
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 0.85,
    },
    '&$selected': {
      color: theme.palette.primary.main,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
  },
}));

const a11yProps = (value: string | number) => {
  return {
    id: `simple-tab-${value}`,
    'aria-controls': `tabpanel-${value}`,
  };
};

export type TabsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelected: (newSelected: any) => void;
  tabs: Array<{
    icon?: ComponentType;
    label: string;
    value: number | string;
  }>;
  marginBottom?: boolean;
};

const Tabs = ({ tabs, selected, setSelected }: TabsProps) => (
  <CustomTabs aria-label='Tabs' onChange={(e, newTab) => setSelected(newTab)} value={selected} variant='scrollable'>
    {tabs.map((tab, index) => {
      const Icon = tab.icon && styled(tab.icon)({ verticalAlign: 'middle', marginRight: 7, marginBottom: 3 });
      return (
        <Tab
          key={index}
          label={
            <div>
              {Icon && <Icon />}
              {tab.label}
            </div>
          }
          value={tab.value}
          {...a11yProps(tab.value)}
        />
      );
    })}
  </CustomTabs>
);

export default Tabs;
