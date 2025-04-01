import { InfoOutlined, Mediation, Numbers, TextSnippet, Visibility } from '@mui/icons-material';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

type TemplateEditSectionHeadingProps = {
    readonly type: 'defaultValue' | 'displayName' | 'mappingInfo' | 'multiplicity';
};

export function TemplateEditSectionHeading(props: TemplateEditSectionHeadingProps) {
    const t = useTranslations('pages.templates');
    const getIcon = () => {
        switch (props.type) {
            case 'displayName':
                return <Visibility fontSize="small" />;
            case 'mappingInfo':
                return <Mediation fontSize="small" />;
            case 'multiplicity':
                return <Numbers fontSize="small" />;
            case 'defaultValue':
            default:
                return <TextSnippet fontSize="small" />;
        }
    };

    const getTitle = () => {
        switch (props.type) {
            case 'displayName':
                return t('displayName');
            case 'mappingInfo':
                return t('mappingInfo');
            case 'defaultValue':
                return t('defaultValue');
            case 'multiplicity':
                return t('multiplicity');
            default:
                return '';
        }
    };

    const getDescription = () => {
        switch (props.type) {
            case 'mappingInfo':
                return t('mappingInfoDescription');
            case 'multiplicity':
                return t('multiplicityDescription');
            default:
                return undefined;
        }
    };
    return (
        <>
            <Divider sx={{ my: 3 }} />
            <Box display="flex" alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
                <Box display="flex" alignItems="center" sx={{ mr: '3px' }}>
                    {getIcon()}
                </Box>
                <Typography variant="body2">{getTitle()}</Typography>
                {getDescription() && (
                    <Tooltip title={getDescription() || <></>}>
                        <InfoOutlined sx={{ color: 'text.secondary', ml: '3px' }} fontSize="small" />
                    </Tooltip>
                )}
            </Box>
        </>
    );
}
