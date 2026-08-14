## Folder Structure

### Naming Conventions:

Naming convention for components and component files: Camel Case (e.g. FileName.tsx)  
Naming convention for folders: Kebab Case (e.g. folder-name)

### Folder Structure:

In general, we want to group code by pages and features, not by file type.
Each route segment has a `_components` folder which contains all elements which are solely used in this route.  
Files that are shared between route segments are located in the following shared folders:

-   `\layout`: Overall application appearance including theming, menu etc.
-   `\lib`: Shared logic and types as well as interfaces to external apis.
-   `\components`: All components which can be shared between several routes.
-   `\assets`: Static assets such as images, icons or other similar files.
-   `\stores`: Shared client-side state stores.

```
|- src
|--- app/[locale]
|----- _components
|------- shared components for the [locale] segment
|----- viewer
|------- _components
|--------- submodel
|--------- submodel-elements
|--------- transfer
|------- page.tsx
|----- settings
|------- _components
|--------- id-settings
|--------- role-settings
|--------- mnestix-infrastructure
|------- page.tsx
|----- templates
|------- _components
|--------- blueprint-edit
|------- [id]
|--------- page.tsx
|------- page.tsx
|----- product
|------- _components
|------- ...
|----- compare
|------- _components
|--------- add-aas
|------- ...
|----- list
|------- _components
|--------- filter
|------- ...
|----- asset
|------- _components
|------- ...
|--- assets
|--- components
|----- all shared components
|--- layout
|----- menu
|----- theme
|--- lib
|----- api
|----- util
|----- hooks
|----- types
|----- enums
|----- services
|----- errors
|----- database
|----- ...
|--- stores
|--- i18n
```
