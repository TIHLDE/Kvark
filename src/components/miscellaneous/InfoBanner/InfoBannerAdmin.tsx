// import { Stack } from '@mui/material';
// import Grid from '@mui/material/Grid';
// import LinearProgress from '@mui/material/LinearProgress';
// import { isError } from '@sentry/utils';
// import { reset } from 'canvas-confetti';
// import { makeStyles } from 'makeStyles';
// import { useCallback, useEffect, useMemo } from 'react';
// import { useForm } from 'react-hook-form';

// import { InfoBanner } from 'types';

// import { useCreateInfoBanner, useDeleteInfoBanner, useInfoBanner, useInfoBanners, useUpdateInfoBanner } from 'hooks/InfoBanner';
// import { useSnackbar } from 'hooks/Snackbar';

// const useStyles = makeStyles()((theme) => ({
//   grid: {
//     display: 'grid',
//     gridGap: theme.spacing(2),
//     gridTemplateColumns: '1fr 1fr',
//     [theme.breakpoints.down('md')]: {
//       gridGap: 0,
//       gridTemplateColumns: '1fr',
//     },
//   },
//   margin: {
//     margin: theme.spacing(2, 0, 1),
//     borderRadius: theme.shape.borderRadius,
//     overflow: 'hidden',
//   },
// }));

// export type BannerEditorProps = {
//   bannerId: string | null;
//   goToBanner: (newBanner: number | null) => void;
// };

// const InfoBannerEditor = ({ bannerId, goToBanner }: BannerEditorProps) => {
//   const showSnackbar = useSnackbar();
//   const { classes } = useStyles();
//   const { control, handleSubmit, register, formState, getValues, reset, watch, setValue } = useForm<InfoBanner>();
//   const { data = [], isError, isLoading } = useInfoBanners();
//   const createBanner = useCreateInfoBanner();
//   const updateBanner = useUpdateInfoBanner(bannerId || '');
//   const deleteBanner = useDeleteInfoBanner(bannerId || '');
//   const isUpdating = useMemo(
//     () => createBanner.isLoading || updateBanner.isLoading || deleteBanner.isLoading,
//     [createBanner.isLoading, updateBanner.isLoading, deleteBanner.isLoading],
//   );

//   useEffect(() => {
//     !isError || goToBanner(null);
//   }, [isError]);

//   const setValues = useCallback(
//     (newValues: InfoBanner | null) => {
//       reset({
//         title: newValues?.title || '',
//         image: newValues?.image || '',
//         image_alt: newValues?.image_alt || '',
//         description: newValues?.description || '',
//         url: newValues?.url || '',
//         visiblefrom: newValues?.visiblefrom || '',
//         visibleuntil: newValues?.visibleuntil || '',
//       });
//     },
//     [reset],
//   );

//   const submit = async (data: InfoBanner) => {
//     bannerId
//       ? updateBanner.mutate(
//           { ...data },
//           {
//             onSuccess: () => {
//               showSnackbar('Info banneret ble oppdatert', 'success');
//             },
//             onError: (err) => {
//               showSnackbar(err.detail, 'error');
//             },
//           },
//         )
//       : createBanner.mutate(
//           { ...data },
//           {
//             onSuccess: () => {
//               showSnackbar('Info banneret ble opprettet', 'success');
//             },
//             onError: (err) => {
//               showSnackbar(err.detail, 'error');
//             },
//           },
//         );
//   };

//   if (isLoading) {
//     return <LinearProgress />;
//   }

//   return null;
//   // <div>
//   //   <Stack component={List} disablePadding gap={1}>
//   //     {data !== undefined && data.map((banner) => <GroupFormAdminListItem form={form} key={form.id} />)}
//   //   </Stack>
//   // </div>
// };
