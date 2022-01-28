// // React
// import { useCallback, useState, useEffect } from 'react';

// // Material-UI
// import { Box, Button, Typography } from '@mui/material';
// import { makeStyles } from 'makeStyles';

// // Components
// import Dialog from 'components/layout/Dialog';
// import PictureUpload from './PictureUpload';

// const useStyles = makeStyles()((theme) => ({
//   dialog: {
//     display: 'grid',
//     gridGap: theme.spacing(1),
//     padding: theme.spacing(2),
//     background: theme.palette.background.default,
//   },
// }));

// const PictureEditor = () => {
//   const [open, setOpen] = useState<boolean>(false);
//   const { classes } = useStyles();
//   const setValues = useCallback(
//     (newValues: Picture | null) => {
//       reset({
//         title: newValues?.title || '',
//         image: newValues?.image || '',
//         description: newValues?.description || '',
//         image_alt: newValues?.image_alt || '',
//       });
//     },
//     [reset],
//   );

//   useEffect(() => {
//     setValues(data || null);
//   }, [data, setValues]);

//   return (
//     <Box sx={{ mt: '100px', padding: '10' }}>
//       <Dialog onClose={() => setOpen(false)} open={open}></Dialog>
//     </Box>
//   );
// };

// export default PictureEditor;
