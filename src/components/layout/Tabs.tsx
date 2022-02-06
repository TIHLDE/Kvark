import { ComponentType } from 'react';

// Material UI Components
import { Tabs as MuiTabs, Tab as MuiTab, styled, TabsProps as MuiTabsProps } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

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
    '& .Mui-selected': {
      color: theme.palette.primary.main,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
  },
}));

const a11yProps = (value: string | number) => ({
  id: `tab-${value}`,
  'aria-controls': `tabpanel-${value}`,
});

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
} & MuiTabsProps;

const Tabs = ({ tabs, selected, setSelected, ...props }: TabsProps) => (
  <CustomTabs
    aria-label='Tabs'
    onChange={(e, newTab) => setSelected(newTab)}
    value={tabs.some((t) => t.value === selected) ? selected : tabs[0]?.value}
    variant='scrollable'
    {...props}>
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

export type RouterTabsProps = {
  tabs: Array<{
    icon?: ComponentType;
    label: string;
    to: string;
  }>;
  marginBottom?: boolean;
} & MuiTabsProps;

export const RouterTabs = ({ tabs, ...props }: RouterTabsProps) => {
  const location = useLocation();
  return (
    <CustomTabs aria-label='Tabs' value={location.pathname} variant='scrollable' {...props}>
      {tabs.map((tab, index) => {
        const Icon = tab.icon && styled(tab.icon)({ verticalAlign: 'middle', marginRight: 7, marginBottom: 3 });
        return (
          <Tab
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            component={Link}
            key={index}
            label={
              <div>
                {Icon && <Icon />}
                {tab.label}
              </div>
            }
            replace
            to={tab.to}
            value={tab.to}
            {...a11yProps(tab.to)}
          />
        );
      })}
    </CustomTabs>
  );
};

export default Tabs;
