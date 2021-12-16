import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import URLS from 'URLS';
import { formatDate, urlEncode } from 'utils';
import parseISO from 'date-fns/parseISO';
import { usePageTree, useCreatePage, useUpdatePage, useDeletePage } from 'hooks/Pages';
import { useSnackbar } from 'hooks/Snackbar';
import { HavePermission } from 'hooks/User';
import { Page, PageTree } from 'types';
import { PermissionApp } from 'types/Enums';

import { Button, Typography, Collapse, Divider, LinearProgress } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import RightIcon from '@mui/icons-material/ChevronRightRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import AddIcon from '@mui/icons-material/AddRounded';

// Project components
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import SubmitButton from 'components/inputs/SubmitButton';
import { ImageUpload } from 'components/inputs/Upload';
import TextField from 'components/inputs/TextField';

type ITreeProps = IPagesAdminProps & {
  selectedNode: string;
  setSelectedNode: (newNode: string) => void;
};

const Tree = ({ selectedNode, setSelectedNode, page }: ITreeProps) => {
  const { data, error, isLoading } = usePageTree();
  const [viewTree, setViewTree] = useState(false);

  const renderTree = (node: PageTree, parentPath: string) => {
    const id = `${parentPath}${node.slug}${node.slug === '' ? '' : '/'}`;
    if (id === page.path) {
      return null;
    }
    return (
      <TreeItem key={id} label={node.title} nodeId={id === '' ? '/' : id}>
        {Array.isArray(node.children) && node.children.map((childNode) => renderTree(childNode, id))}
      </TreeItem>
    );
  };

  if (isLoading) {
    return <LinearProgress />;
  } else if (error) {
    return <Typography>{error.detail}</Typography>;
  } else if (data) {
    return (
      <Paper noPadding sx={{ mt: 1, mb: 2 }}>
        <Button endIcon={viewTree ? <ExpandLessIcon /> : <ExpandMoreIcon />} fullWidth onClick={() => setViewTree((prev) => !prev)}>
          Flytt siden
        </Button>
        <Collapse in={viewTree}>
          <Typography align='center' sx={{ my: 1 }} variant='subtitle2'>
            Trykk på mappen du vil flytte denne siden til
          </Typography>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['/', ...page.path.split('/').map((slug) => `${slug}/`)]}
            defaultExpandIcon={<RightIcon />}
            onNodeSelect={(e: unknown, node: string) => setSelectedNode(node)}
            selected={selectedNode}>
            {renderTree({ ...data, slug: '' }, '')}
          </TreeView>
        </Collapse>
      </Paper>
    );
  } else {
    return null;
  }
};

type IFormProps = IPagesAdminProps & {
  mode: Modes;
  closeDialog: () => void;
};

type FormData = Pick<Page, 'title' | 'content' | 'image' | 'image_alt'>;

const Form = ({ closeDialog, mode, page }: IFormProps) => {
  const parentPath = page.path.slice(0, page.path.length - page.slug.length - 1);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage(page.path);
  const deletePage = useDeletePage(page.path);
  const { register, formState, handleSubmit, watch, setValue } = useForm<FormData>(mode === Modes.EDIT ? { defaultValues: page } : {});
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [treeNode, setTreeNode] = useState(parentPath);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (data: FormData) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (mode === Modes.EDIT) {
      await updatePage.mutate(
        { ...page, ...data, slug: urlEncode(data.title), path: treeNode === '/' ? '' : treeNode },
        {
          onSuccess: (data) => {
            showSnackbar('Siden ble oppdatert', 'success');
            closeDialog();
            navigate(`${URLS.wiki}${data.path}`);
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
          },
        },
      );
    } else {
      await createPage.mutate(
        { ...data, slug: urlEncode(data.title), path: page.path },
        {
          onSuccess: (data) => {
            showSnackbar('Siden ble opprettet', 'success');
            closeDialog();
            navigate(`${URLS.wiki}${data.path}`);
          },
          onError: (e) => {
            showSnackbar(e.detail, 'error');
          },
        },
      );
    }
    setIsLoading(false);
  };

  const handleDeletePage = async () => {
    await deletePage.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        setShowDeleteDialog(false);
        closeDialog();
        navigate(`${URLS.wiki}${parentPath}`);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <TextField disabled={isLoading} formState={formState} label='Tittel' {...register('title', { required: 'Feltet er påkrevd' })} required />
        <MarkdownEditor formState={formState} {...register('content')} />
        <ImageUpload formState={formState} label='Velg bilde' register={register('image')} setValue={setValue} watch={watch} />
        <TextField disabled={isLoading} formState={formState} label='Bildetekst' {...register('image_alt')} />
        {mode === Modes.EDIT && <Tree page={page} selectedNode={treeNode} setSelectedNode={setTreeNode} />}
        <SubmitButton disabled={isLoading} formState={formState}>
          {mode === Modes.EDIT ? 'Lagre' : 'Opprett'}
        </SubmitButton>
        {mode === Modes.EDIT && (
          <>
            <Button
              color='error'
              disabled={isLoading || Boolean(page.children.length)}
              fullWidth
              onClick={() => setShowDeleteDialog(true)}
              sx={{ mt: 2 }}
              variant='outlined'>
              Slett side
            </Button>
            {Boolean(page.children.length) && (
              <Typography align='center' variant='body2'>
                Du kan ikke slette en side som har undersider. Slett eller flytt undersidene først. (Evt snakk med Index)
              </Typography>
            )}
            <Dialog confirmText='Slett' onClose={() => setShowDeleteDialog(false)} onConfirm={handleDeletePage} open={showDeleteDialog} titleText='Slett side'>
              Er du helt sikker på at du vil slette denne siden?
            </Dialog>
            <Divider sx={{ my: 2 }} />
            <Typography variant='caption'>Opprettet: {formatDate(parseISO(page.created_at))}</Typography>
            <br />
            <Typography variant='caption'>Sist oppdatert: {formatDate(parseISO(page.updated_at))}</Typography>
          </>
        )}
      </form>
    </>
  );
};

export type IPagesAdminProps = {
  page: Page;
};
enum Modes {
  CREATE,
  EDIT,
}

const WikiAdmin = ({ page }: IPagesAdminProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState(Modes.CREATE);

  const edit = () => {
    setMode(Modes.EDIT);
    setShowDialog(true);
  };
  const create = () => {
    setMode(Modes.CREATE);
    setShowDialog(true);
  };

  return (
    <HavePermission apps={[PermissionApp.PAGE]}>
      {page.path !== '' && (
        <Button endIcon={<EditIcon />} fullWidth onClick={edit} variant='outlined'>
          Rediger side
        </Button>
      )}
      <Button endIcon={<AddIcon />} fullWidth onClick={create} variant='outlined'>
        Ny underside
      </Button>
      <Dialog onClose={() => setShowDialog(false)} open={showDialog} titleText={mode === Modes.EDIT ? 'Rediger side' : 'Opprett side'}>
        <Form closeDialog={() => setShowDialog(false)} mode={mode} page={page} />
      </Dialog>
    </HavePermission>
  );
};

export default WikiAdmin;
