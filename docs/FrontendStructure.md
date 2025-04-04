## Folder Structure

### Naming Conventions:

Naming convention for components and component files: Camel Case (e.g. FileName.tsx)  
Naming convention for folders: Kebab Case (e.g. folder-name)

### Folder Structure:

In general, we want to group code by pages and features, not by file type.
Each route segment has a `/components` folder which contains all elements which are solely used in this route.  
Files that are shared between route segments, are located in the following shared folders:

- `\layout`: Overall application appearance including theming, menu etc.
- `\lib`: Shared logic and types as well as interfaces to external apis.
- `\components`: All components which can be shared between several routes.
- `\assets`: Static assets such as images, icons oder other similar files.

```
|- src
|--- app/[locale]
|----- viewer
|------- components
|--------- submodel
|--------- submodel-elements
|------- page.tsx
|----- settings
|------- components
|--------- theme-settings
|--------- id-generation-settings
|------- *page.tsx*
|----- templates
|------- components
|--------- template-edit
|------- [id]
|--------- *page.tsx*
|------- *page.tsx*
|----- compare
|------- ...
|----- list
|------- ...
|----- asset
|------- ...
|--- assets
|--- components
|----- all shared components
|--- layout
|----- menu
|----- theme
|--- lib
|----- apis
|----- utils
|----- hooks
|----- types
|----- enums
|----- ...
```
