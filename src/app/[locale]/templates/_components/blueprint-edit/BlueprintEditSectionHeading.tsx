import { InfoOutlined, Mediation, Repeat, Numbers, TextSnippet, Visibility } from '@mui/icons-material';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

type BlueprintEditSectionHeadingProps = {
    readonly type: 'defaultValue' | 'displayName' | 'mappingInfo' | 'multiplicity' | 'collectionMappingInfo';
};

export function BlueprintEditSectionHeading(props: BlueprintEditSectionHeadingProps) {
    const t = useTranslations('pages.templates');
    const getIcon = () => {
        switch (props.type) {
            case 'displayName':
                return <Visibility fontSize="small" />;
            case 'mappingInfo':
                return <Mediation fontSize="small" />;
            case 'collectionMappingInfo':
                return <Repeat fontSize="small" />;
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
            case 'collectionMappingInfo':
                return t('collectionMappingInfo');
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
            case 'collectionMappingInfo':
                return t('collectionMappingInfoDescription');
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
