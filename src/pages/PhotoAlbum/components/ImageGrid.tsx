import React from 'react';
import { ImageListItemBar, ImageList, ImageListItem } from '@mui/material';

const ImageGrid = () => {
  return (
    <ImageList cols={3} gap={8} variant='masonry'>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img alt={item.title} loading='lazy' src={`${item.img}?w=248&fit=crop&auto=format`} srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`} />
          <ImageListItemBar position='below' />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default ImageGrid;
