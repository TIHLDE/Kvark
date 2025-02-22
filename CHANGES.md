# Changes from React Router V7 re-write

### Pages rewritten:
- Pages that use the new clientLoaders:
  - `/grupper` - and all subpaths
  - `arrangementer` - and all subpaths
- `/arrangementer/:id/registrering` - Moved to `/arragementer/registrering/:id`
- `/wiki` - Will now redirect to the new wiki: https://wiki.tihlde.org/

### Component changes
- Replaced old react-dropzone with @uploadthing/react (ESM support required)
  - This only replaces the useDropzone hook.

### Other changes
- Replaced constate with jotai for misc hooks
- Added ~/ import alias for src/ (required by react-router)
- Wave svgs converted to JSX components
- New type-safe URL Link Component `<NavLink to="/:id" params={{ id: "1" }}>`
- Deleted wiki components. since everything moved to `https://wiki.tihlde.org`
- Caching with @epic-stack/cachified for clientLoaders and serverLoaders(in the future)

### What i want to do.
- Convert all `Link` to the typesafe variant either with `href()` or `NavLink`
  - This will probably happen after merge with dev
- Slowly convert to server-side fetching
  - Using loaders on the server can cache data between users. making requests super fast
- Move from using `pages` as the directory, to use `routes` directory
  - Files management should look like the paths (for ease of use).


