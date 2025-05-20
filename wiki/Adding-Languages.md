## Adding your Language to Mnestix

### Available Languages

Currently, Mnestix Browser supports three languages, available from the language selector located on the top-right side:

-   English (default language)
-   Deutsch (German)
-   Español (Spanish)

### How do I add my own language to Mnestix?

Mnestix browser supports the addition of more languages locally.

To add a language, changes are needed on:

-   ` src/locale` folder → Add JSON file with translations.
-   ` src/i18n/routing.ts` file → Add entry with language code for translations.
-   ` src/layout/LanguageSelector.tsx` file → Add entry with language code and complete language name.

#### Add a JSON file with the translations

Messages around the browser are loaded from language files named `{language_code}.json` where language code represents
the two letter code for the language (i.e. English → en).

To add a language create a file with these naming convention under ` src/locale` folder and copy the contents of another language
file inside the same folder. Then, change the strings to your language for all the messages as in the example below:

-   In English version `en.json`

```yaml
'buttons':
    {
        'add': 'Add',
        'back': 'Back',
        'cancel': 'Cancel',
        'create': 'Create Rule',
        'delete': 'Delete',
        'edit': 'Edit',
        'save': 'Save',
    }
```

-   In German version `de.json`

```yaml
'buttons':
    {
        'add': 'Hinzufügen',
        'back': 'Zurück',
        'cancel': 'Abbrechen',
        'create': 'Regel erstellen',
        'delete': 'Löschen',
        'edit': 'Bearbeiten',
        'save': 'Speichern',
    }
```

#### Add language code referencing the translations

For the language to be selectable from the Mnestix browser, the language router needs to know it exists, this can be indicated in
` src/i18n/routing.ts` file.

Open the file and add your language to `locales` as in example below:

```tsx
locales: ['en', 'de'] --> Add your language code (i.e. 'es') --> locales: ['en', 'de', 'es']
```

> ⚠️ **Important:** After making the changes, you might need to rebuild the Mnestix browser for the changes to take effect.

#### Add language complete name to selector component

For the language to show correctly in the selector component, a new entry relating the language name and the corresponding code needs
to be added to the selector.

For this, change `languageOptions` variable and add an entry for the new language, example for adding Spanish below:

```tsx
const languageOptions = [
    { language: 'English', code: 'en' },
    { language: 'Deutsch', code: 'de' },
    //Add Spanish full language name and relate to language code
    { language: 'Español', code: 'es' },
];
```

Note that for the language selector to be effective, the language complete name should be included translated to that language, so
the users that cannot understand other languages can correctly set Mnestix to their own language.

### Contributing your language

Adding a language is a time-consuming task. If you have invested the time to create a new language support, we would appreciate it if you
contribute the language to the Mnestix browser repository. Please see [Contributing](Contributing) on how to contribute your language to the project.
