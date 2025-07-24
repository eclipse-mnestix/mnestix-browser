One of Mnestix’ goals is to make it as easy as possible to visualize data.

Out of the box, Mnestix offers a general visualization for submodels. Additionally, Mnestix offers a selection of tailored visualizations for standardized and not standardized submodels.
Those include for example visualizations for the Product Carbon Footprint submodel, the Hierarchical Structures submodel and the Time Series submodel. Additionally, Mnestix provides tailored visualizations for a selection of submodel elements, such as Address components, Document components and Entity components.

In order to realize your own use cases, Mnestix provides a means to implement your own custom visualizations for submodels and submodel elements.
The following steps will explain how you can provide these visualizations.

![image](https://github.com/user-attachments/assets/87635f84-e5ee-4f69-9113-8300f495fa28)

> [!TIP]
> For a starting point we provide an example submodel visualization at [SoftwareNameplate](https://github.com/eclipse-mnestix/mnestix-browser-example-submodel-visualizations).
> We encourage you to use this repository as a template for your own visualization.
> Throughout this guide are tips based on this submodel visualization.

# 1. Fork and Clone the Mnestix GitHub repository

> [!NOTE]  
> If you are not planning on contributing to Mnestix you can also skip the fork and directly clone the Mnestix repository. You will not be able to create branches and pull requests this way.

## Fork Mnestix

As for any other contribution to Mnestix, you will have to start by forking the GitHub repository.
You may fork either the [main branch](https://github.com/eclipse-mnestix/mnestix-browser) for stable release code or the [dev branch](https://github.com/eclipse-mnestix/mnestix-browser/tree/dev) for features which may still be under active development.
On the repository page you will then have the option to fork the code to your own account.

![mnestix-fork](https://github.com/user-attachments/assets/d33fac6d-c8b0-4139-a00e-b0646367b0ce)

## Clone Mnestix

Clone the Mnestix code from the GitHub repository.
You may clone either the [main branch](https://github.com/eclipse-mnestix/mnestix-browser) for stable release code or the [dev branch](https://github.com/eclipse-mnestix/mnestix-browser/tree/dev) for features which may still be under active development.
If you have forked the Mnestix repository in the previous task, clone from your private repository.

## Checking out Mnestix

It is time to check if everything is set up correctly.
In this guide we assume you have installed docker and node correctly.
For a full guide on how to develop locally please consider our [Development guide](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Getting-started-with-developing).
All commands shown should be executed in the root directory of Mnestix.

First you need to install all required packages.
This can be done with `yarn install` and may take some time depending on your network connection.
If you have problems executing yarn, you might need to enable it using `corepack enable` first.

Now you can start up all background services as docker containers.
We provide a few node scripts to ease the startup process.
During development `yarn docker:backend` will suffice in most cases.
For a full overview please check out the [compose guide](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Docker-Compose-Files).

To start the Mnestix browser you may use `yarn dev`.
To make sure debugging and hot-reloading works as expected you might instead use `yarn debug`.
You can now open `localhost:3000` in your internet browser and should see the Mnestix dashboard.
It might take a few extra seconds at the first time as node is building your project on the go.

> [!Tip]
> You can try to find the Mnestix AAS in the list or search for it on the dashboard directly by entering its ID `https://vws.xitaso.com/aas/mnestix`.

# 2. Create your React component

We suggest to create a directory for your submodel visualization inside `src/user-plugins/submodels`.

> [!TIP]
> To clone the software nameplate you may go into the `src/user-plugins/submodels/` directory and run `git clone https://github.com/eclipse-mnestix/mnestix-browser-example-submodel-visualizations.git`.
> You can browse the example AAS for the SoftwareNameplate with the ID `https://vws.xitaso.com/aas/mnestix` inside the Mnestix browser.

You can find all currently existing submodel visualizations at the following path: `src/app/[locale]/viewer/_components/submodel`.
You might want to have a look at them for further examples.

## Creating a visualization for a submodel

After you created the sub-directory for your own visualization, you can create your `.tsx`-file and start developing the component.
Custom submodel visualizations use the input type `SubmodelVisualizationProps`, which contains the submodel data.

You can use this stump to develop a custom submodel visualization:

```tsx
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export default function CustomSubmodel({ submodel }: SubmodelVisualizationProps) {
    return <h1>This is the custom visualization for submodel {submodel.idShort}</h1>;
}
```

> [!TIP]
> For now the custom visualization exists but will not be shown for the SoftwareNameplate submodel.
> We see the generic overview of submodel data.
>
> <img src="https://github.com/user-attachments/assets/9cd75d47-c9ce-4c97-a61e-6dd0efdcbbe9" width="75%" />

## Map the visualization

In order for Mnestix to automatically use your visualization, you have to provide the mapping between your visualization and the semantic id which your custom visualization should be used for.
This is done in the file `src/app/[locale]/viewer/_components/submodel/SubmodelsCustomVisualizationMap.ts` which looks similar to this:

```ts
export const submodelsCustomVisualizationMap = {
    [SubmodelSemanticIdEnum.CoffeeConsumptionContainer]: CoffeeConsumptionDetail,
    [SubmodelSemanticIdEnum.CarbonFootprint]: CarbonFootprintDetail,
    [SubmodelSemanticIdEnum.CarbonFootprintIRDI]: CarbonFootprintDetail,
    [SubmodelSemanticIdEnum.ReferenceCounterContainer]: ReferenceCounterDetail,
    [SubmodelSemanticIdEnum.TimeSeries]: TimeSeriesDetail,
    [SubmodelSemanticIdEnum.HierarchicalStructuresV10]: HierarchicalStructuresDetail,
    [SubmodelSemanticIdEnum.HierarchicalStructuresV11]: HierarchicalStructuresDetail,
    [SubmodelSemanticIdEnum.BillOfApplications]: BillOfApplicationsDetail,
    [/*Your semantic id as a string*/]: /*React component name*/,
};
```

Just add an entry containing the semantic id as a key and your React component as the value.
Important: Don’t forget to import your React component at the top of the file!

> [!NOTE]
> You might also want to add your semantic id to the `SubmodelSemanticIdEnum` used in the examples above.
> This is not required, you can use a simple string as the key.
> But it may make particular sense for standardized submodels.

> [!TIP]
> For the SoftwareNameplate the added mapping line will be `['https://admin-shell.io/idta/SoftwareNameplate/1/0']: SoftwareNameplateDetail,`.
> We see the visualization now, but are still lacking the internationalization.
>
> <img src="https://github.com/user-attachments/assets/5dff3970-140c-4fba-9ed8-92822d160d22" width="75%">

# 3. Reading data from your submodel

You probably want to display some information from the submodel.
We provide you with a convenience method to search for a specific value in the submodel.
Import it at the top of your file

```ts
import { findValueByIdShort } from 'lib/util/SubmodelResolverUtil';
```

and use it in your component

```ts
const value = findValueByIdShort(submodel.submodelElements, 'MyIDshort', 'en');
```

It will automatically return the requested language value for a MultiLanguageProperty.

# 4. Internationalization

We support internationalization for both submodel data in MultiLanguageProperty fields as well as predefined messages.
Make sure to import the correct hooks on top of the file.

```ts
import { useLocale, useTranslations } from 'next-intl';
```

## Using current locale in MultiLanguageProperty

You can use the `findValueByIdShort` method with your preferred locale as a parameter.
This may be changed to always use the currently selected language by calling the `useLocale` hook.

```ts
const locale = useLocale();
const value = findValueByIdShort(submodel.submodelElements, 'MyIDshort', locale);
```

## Using current locale for internationalized messages

We support message internationalization by the `useTranslations` hook.
To keep things organized we provide a directory for all user-plugin translations at `src/user-plugins/locale`.
Add your translations in each locale file you want to support.
Be aware that these files is shared by all user-plugins so merge the files individually and not just overwrite the content.

You may now access the localized messages in your component by getting the translations for your submodel and then selecting the actual message.

```tsx
const t = useTranslations('user-plugins.submodels.YourCustomSubmodel');
return <> {t('YourMessage')} </>;
```

For a full documentation of what is possible with next-intl visit their [website](https://next-intl.dev/docs/usage/messages).

> [!TIP]
> We have provided the locale files in the repository, but you still need to merge them with the user-plugin locale files.
> The merged file for `locale/en.json` whould look something like this:
>
> ```json
> {
>     "user-plugins": {
>         "submodels": {
>             "hello-world-component": {
>                 "title": "Hello World!"
>             },
>             "SoftwareNameplate": {
>                 "welcome": "Welcome to Mnestix by",
>                 "slogan": "Asset Administration Shell made easy!",
>                 "versionInfo": "This is Mnestix version {version}. It was released on {releaseDate}."
>             }
>         }
>     }
> }
> ```
>
> Now the submodel visualization will show the translated values from the internationalization file.
>
> <img src="https://github.com/user-attachments/assets/e3d814ff-ceab-47a5-94c9-16afb518cb2f" width="75%">

# 5. (Optional) Create a pull request

Especially when you are creating a visualization for a standardized submodel, we encourage you to contribute it to the Open Source Mnestix repository, so that others can profit from it as well! This can be done by creating a pull request on the GitHub page, like seen in the following picture:

![mnestix-pull-request](https://github.com/user-attachments/assets/2966ad7a-702f-4e00-bde8-a3554a0faed3)

After clicking on “New pull request”, you can select “Compare across forks” and select your own repository, like seen in the picture below:

![mnestix-compare-changes](https://github.com/user-attachments/assets/b9167444-2117-48fa-8fc0-b399f84577d7)

Make sure to select the dev branch as the base branch!

After you have created the pull request, it will get reviewed and merged, as soon as everything is fine and the request got approved.

In case you don’t want to share your visualization with the public, you don’t have to create the pull request. Just be aware, that your project will from now on live in its own repository and not automatically get any updates from the main repository.
In order to get updates, you will have to manually merge the main repository in to your forked project with every new update. Furthermore, you have to build and publish the docker image by yourself if you wish to use your custom visualization in a productive environment.
