import { ReactElement, ReactNode, useEffect } from 'react';

import Container, { ContainerProps } from 'components/layout/Container';
import { SetNavigationOptions, useSetNavigationOptions } from 'components/navigation/Navigation';
export type PageProps = {
  children?: ReactNode;
  banner?: ReactElement;
  maxWidth?: ContainerProps['maxWidth'];
  options?: SetNavigationOptions;
};

const Page = ({ options, maxWidth = 'xl', banner, children }: PageProps) => {
  useSetNavigationOptions(options);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {banner}
      {maxWidth === false ? children : <Container maxWidth={maxWidth}>{children || <></>}</Container>}
    </>
  );
};

export default Page;
