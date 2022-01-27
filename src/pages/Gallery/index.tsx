// Project Components
import CreateAlbumDialog from './components/CreateGallery';
import Banner from 'components/layout/Banner';
import Page from 'components/navigation/Page';
const Gallery = () => {
  return (
    <Page banner={<Banner />}>
      <CreateAlbumDialog />
    </Page>
  );
};

export default Gallery;
