import { useFetchWrapped } from 'hooks/Wrapped';

import Page from 'components/navigation/Page';

/**
 * Fetch all statistics within this file as well.
 */

const Wrapped = () => {
  const { data, isLoading } = useFetchWrapped(new Date().getFullYear());
  return <Page>asdasda</Page>;
};

export default Wrapped;
