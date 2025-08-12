import { TableCell } from '@mui/material';
import { AasListConfig, AasListEntry } from 'lib/types/AasListEntry';
import PictureTableCell from 'components/basics/listBasics/PictureTableCell';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useRouter } from 'next/navigation';
import { RoundedIconButton } from 'components/basics/Buttons';
import { ArrowForward } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import { useEnv } from 'app/EnvProvider';

type GenericAasListTableRowProps = {
    aasListEntry: AasListEntry;
} & AasListConfig;

const tableBodyText = {
    lineHeight: '150%',
    fontSize: '16px',
    color: 'text.primary',
};

export const GenericAasListEntry = ({ aasListEntry, ...config }: GenericAasListTableRowProps) => {
    const navigate = useRouter();
    const env = useEnv();
    const t = useTranslations('pages.aasList');

    const navigateToAas = () => {
        const pageToGo = env.PRODUCT_VIEW_FEATURE_FLAG ? '/product' : '/viewer';
        const aasId = aasListEntry.aasId;
        const repoUrl = aasListEntry.repositoryUrl;
        const infrastructureName = aasListEntry.infrastructureName;

        navigate.push(
            `${pageToGo}/${encodeBase64(aasId)}${repoUrl ? `?repoUrl=${encodeURI(repoUrl)}` : ''}${infrastructureName ? `&infrastructure=${infrastructureName}` : ''}`,
        );
    };

    return (
        <>
            {config.showThumbnail && (
                <PictureTableCell>
                    <ImageWithFallback
                        src={aasListEntry.thumbnailUrl ?? ''}
                        alt={'Thumbnail image for: ' + aasListEntry.assetId}
                        size={100}
                        onClickHandler={() => navigateToAas()}
                    />
                </PictureTableCell>
            )}
            {config.showAasId && (
                <TableCell align="left" sx={tableBodyText} data-testid="list-row-aasId">
                    {aasListEntry.aasId}
                </TableCell>
            )}
            {config.showAssetId && (
                <TableCell align="left" sx={tableBodyText} data-testid="list-row-assetId">
                    {aasListEntry.assetId ?? '-'}
                </TableCell>
            )}
            {config.showAasEndpoint && (
                <TableCell align="left" sx={tableBodyText} data-testid="list-row-aasEndpoint">
                    {aasListEntry.aasEndpoint ?? '-'}
                </TableCell>
            )}
            {config.showRepositoryUrl && (
                <TableCell align="left" sx={tableBodyText} data-testid="list-row-repositoryUrl">
                    {aasListEntry.repositoryUrl ?? '-'}
                </TableCell>
            )}
            {config.showDiscoveryUrl && (
                <TableCell align="left" sx={tableBodyText} data-testid="list-row-discoveryUrl">
                    {aasListEntry.discoveryUrl ?? '-'}
                </TableCell>
            )}
            {config.showRegistryUrl && (
                <TableCell align="left" sx={tableBodyText} data-testid="list-row-registryUrl">
                    {aasListEntry.registryUrl ?? '-'}
                </TableCell>
            )}
            <TableCell align="center">
                <RoundedIconButton
                    endIcon={<ArrowForward />}
                    onClick={() => navigateToAas()}
                    title={t('buttonTooltip')}
                />
            </TableCell>
        </>
    );
};
