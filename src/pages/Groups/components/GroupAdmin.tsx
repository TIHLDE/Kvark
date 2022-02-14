import EditIcon from '@mui/icons-material/Edit';
import { Button, Collapse } from '@mui/material';
import { EMAIL_REGEX } from 'constant';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Group } from 'types';

import { useUpdateGroup } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';

import Bool from 'components/inputs/Bool';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import UserSearch from 'components/inputs/UserSearch';
import Dialog from 'components/layout/Dialog';
import { ShowMoreText, ShowMoreTooltip } from 'components/miscellaneous/UserInformation';

export type UpdateGroupModalProps = {
  group: Group;
};

type FormValues = Pick<Group, 'contact_email' | 'description' | 'fine_info' | 'fines_activated' | 'name' | 'fines_admin' | 'image'>;

const GroupAdmin = ({ group }: UpdateGroupModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, formState, handleSubmit, control, watch, setValue } = useForm<FormValues>({ defaultValues: { ...group } });
  const watchFinesActivated = watch('fines_activated');
  const updateGroup = useUpdateGroup();
  const showSnackbar = useSnackbar();

  const submit = async (formData: FormValues) => {
    updateGroup.mutate(
      { ...formData, fines_admin: formData.fines_admin?.user_id || null, slug: group.slug },
      {
        onSuccess: () => {
          setIsOpen(false);
          showSnackbar('Gruppen ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} startIcon={<EditIcon />} variant='outlined'>
        Rediger gruppen
      </Button>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} titleText='Rediger gruppen'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField formState={formState} label='Gruppenavn' {...register('name', { required: 'Gruppen må ha et navn' })} required />
          <ImageUpload formState={formState} label='Velg bilde' ratio='1:1' register={register('image')} setValue={setValue} watch={watch} />
          <MarkdownEditor formState={formState} label='Gruppebeskrivelse' {...register('description')} />
          <TextField
            formState={formState}
            label='Kontakt e-post'
            {...register('contact_email', {
              pattern: {
                value: EMAIL_REGEX,
                message: 'Ugyldig e-post',
              },
            })}
            type='email'
          />
          <Bool
            control={control}
            formState={formState}
            label={
              <>
                Botsystem
                <ShowMoreTooltip>
                  Bestemmer om botsystemet skal aktiveres for gruppen. I botsystemet kan du lage et lovverk. Brukerene kan så registrere bøter på hverandre med
                  referanse til lovverket, antall bøter og kommentar. Dere kan selv bestemmer hvor mye en bot er verdt og markere om en bot er godkjent og om
                  boten er betalt.
                </ShowMoreTooltip>
              </>
            }
            name='fines_activated'
            type='switch'
          />
          <Collapse in={watchFinesActivated}>
            <UserSearch
              control={control}
              defaultValue={group.fines_admin}
              formState={formState}
              helperText={
                <ShowMoreText>
                  Botsjefen får tilgang til å endre lovverket, godkjenne bøter, markere bøter som betalt og slette bøter. Du som leder av gruppen har også
                  tilgang til dette.
                </ShowMoreText>
              }
              inGroup={group.slug}
              label='Botsjef'
              name='fines_admin'
            />
            <MarkdownEditor
              formState={formState}
              helperText={
                <ShowMoreText>
                  Her kan du skrive praktiske detaljer rundt botsystemet som ikke nødvendigvis er en egen lovparagraf. Dette kan for eksempel være info om hvor
                  mye en bot er verdt, hvordan bøter godkjennes og når lovverket kan revideres.
                </ShowMoreText>
              }
              label='Botsystem praktiske detaljer'
              multiline
              {...register('fine_info')}
              maxRows={10}
            />
          </Collapse>
          <SubmitButton disabled={updateGroup.isLoading} formState={formState} sx={{ mt: 2 }}>
            Oppdater gruppen
          </SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default GroupAdmin;
