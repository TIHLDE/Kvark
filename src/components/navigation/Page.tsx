import { ReactNode, ReactElement } from 'react';

// Project Components
import Container from 'components/layout/Container';
import { useSetNavigationOptions, SetNavigationOptions } from 'components/navigation/Navigation';
export type PageProps = {
  children?: ReactNode;
  banner?: ReactElement;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  navigationOptions?: SetNavigationOptions;
};

const Page = ({ navigationOptions, maxWidth = 'xl', banner, children }: PageProps) => {
  useSetNavigationOptions(navigationOptions);
  return (
    <>
      {banner}
      {maxWidth === false ? children : <Container maxWidth={maxWidth}>{children || <></>}</Container>}
    </>
  );
};

export default Page;
