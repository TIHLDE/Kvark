import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'context/ThemeContext';

interface IProps {
  children: React.ReactNode;
}

const AllProviders = ({ children }: IProps) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customRender = (ui: React.ReactElement, options?: any) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
