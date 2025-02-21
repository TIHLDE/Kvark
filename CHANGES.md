# Changes from React Router V7 re-write

### Pages rewritten:
- `/grupper` - And it's subpaths now uses clientLoaders for data fetching
- `/arrangementer/:id` - Uses data loaders for data fetching
- `/arrangementer/:id/registrering` - Moved to `/arragementer/registrering/:id`

### Component changes
- Replaced old react-dropzone image upload component
  - There is a bug in the new component that happens sometimes when clicking for uploading (not a issue when dragging in images)
  - This component change affects:
    - `/galleri`
    - `/galleri/:id`

### Other changes
- Replaced constate with jotai for misc hooks
- Added ~/ import alias for src/ (required by react-router)
- Wave svgs converted to JSX components

### New Stuff Added

