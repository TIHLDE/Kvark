# Changes from React Router V7 re-write

### Pages rewritten:
- Pages that use the new clientLoaders:
  - `/grupper` - and all subpaths
  - `arrangementer` - and all subpaths
- `/arrangementer/:id/registrering` - Moved to `/arragementer/registrering/:id`
- `/wiki` - Will now redirect to the new wiki: https://wiki.tihlde.org/

### Component changes
- Replaced old react-dropzone image upload component
  - There is a bug in the new component that happens sometimes when clicking for uploading (not a issue when dragging in images)
  - This component change affects:
    - `/galleri`
    - `/galleri/:id`
    - `/admin/bannere` - not tested
    - `/profil` - borked for now
  - Need to test deletion of existing images

### Other changes
- Replaced constate with jotai for misc hooks
- Added ~/ import alias for src/ (required by react-router)
- Wave svgs converted to JSX components
- Added uploadFileWithToast and uploadFormImage utility
- New type-safe URL Link Component `<NavLink to="/:id" params={{ id: "1" }}>`

### What i want to do.
- Convert all `Link` to the typesafe variant either with `href()` or `NavLink`
  - This will probably happen after merge with dev


