import { Box, MenuItem, Select, styled } from '@mui/material';
import { useLocale } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import TranslateIcon from '@mui/icons-material/Translate';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';

/**
 * Language options to translate the language codes i18n uses to Menu options.
 */
const languageOptions = [
    { language: 'English', code: 'en' },
    { language: 'Deutsch', code: 'de' },
    { language: 'Español', code: 'es' },
];

/**
 * Function to adjust the selector version to desktop or mobile.
 */

/**
 * Styled selector -> select component as a dropdown to select language
 */
const LanguageSelect = styled(Select)(({ theme }) => ({
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
    backgroundColor: 'transparent', //takes background color and does not overlap if mobile is narrow
    borderRadius: 0,
    width: 'auto',
    minWidth: 0,

    '& .MuiSelect-select': {
        display: 'inline-flex',
        alignItems: 'center',
        padding: theme.spacing(0.25, 1),
        fontSize: '0.875rem',
        color: theme.palette.background.default,
        whiteSpace: 'nowrap',
        borderRadius: 0,
    },
    '& .MuiSelect-icon': {
        color: theme.palette.background.default,
        fontSize: '1rem',
    },
    //Removes possible borders or shadows unexpected
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiOutlinedInput-root': {
        boxShadow: 'none',
    },
}));

/**
 * Styled MenuItem -> list item in the dropdown menu of the language selector.
 */
const DropDownItem = styled(MenuItem)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': { backgroundColor: theme.palette.grey['500'] },
}));

/**
 *  Component to add a Language selector and its funcitonality.
 */
export function LanguageSelector() {
    const locale = useLocale();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    /**
     * Implementation of language switching by changing 3 first character or url to language (/ + language code in i18n)
     */
    function switchLanguage(language: string) {
        const oldPathname = pathName.slice(4);
        const newPathname = `/${language}/${oldPathname}`;
        const queryString = searchParams.toString();
        const finalUrl = queryString ? `${newPathname}?${queryString}` : newPathname;
        router.push(finalUrl);
    }

    /**
     * Hook to detect if it's mobile version
     */
    const isMobile = useIsMobile();

    /**
     * Returns the component that needs to be rendered for language selector.
     */
    return (
        <>
            <LanguageSelect
                value={locale}
                //Switch language functionality
                onChange={(event) => switchLanguage(event.target.value as string)}
                //Value of the fieldset on the closed menu
                renderValue={() => (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <TranslateIcon
                            fontSize="small"
                            sx={{
                                padding: '0.5rem',
                                '& .MuiSelect-icon': {
                                    fontSize: '1rem',
                                },
                            }}
                        />
                        {(() => {
                            return isMobile ? '' : languageOptions.find((option) => option.code === locale)?.language;
                        })()}
                    </Box>
                )}
                //Styling of child: Dropdown menu
                MenuProps={{
                    MenuListProps: {
                        //No additional padding for the dropdown
                        sx: {
                            paddingTop: 0,
                            paddingBottom: 0,
                        },
                    },
                    PaperProps: { sx: { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }, //Sharp edges for the dropdown menu,
                }}
            >
                {
                    //Iteration to loop over all languages declared on the language equivalence array
                    languageOptions.map((option) => (
                        <DropDownItem value={option.code}>{option.language}</DropDownItem>
                    ))
                }
            </LanguageSelect>
        </>
    );
}
