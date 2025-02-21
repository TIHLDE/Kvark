# Changes from React Router V7 re-write

### Pages rewritten:
- `/grupper` - And it's subpaths now uses clientLoaders for data fetching
- `/arrangementer/:id` - Uses data loaders for data fetching
- `/arrangementer/:id/registrering` - Moved to `/arragementer/registrering/:id`
- `/wiki` - Will now redirect to the new wiki: https://wiki.tihlde.org/

### Component changes
- Replaced old react-dropzone image upload component
  - There is a bug in the new component that happens sometimes when clicking for uploading (not a issue when dragging in images)
  - This component change affects:
    - `/galleri`
    - `/galleri/:id`
    - `/admin/bannere` - not tested
    - `/profil`
  - Need to test deletion of existing images

### Other changes
- Replaced constate with jotai for misc hooks
- Added ~/ import alias for src/ (required by react-router)
- Wave svgs converted to JSX components
- Added uploadFileWithToast and uploadFormImage utility


