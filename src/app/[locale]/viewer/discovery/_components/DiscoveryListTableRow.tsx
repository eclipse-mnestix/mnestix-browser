import { TableCell } from '@mui/material';
import { IDiscoveryListEntry } from 'lib/types/DiscoveryListEntry';
import PictureTableCell from 'components/basics/listBasics/PictureTableCell';
import { useAasOriginSourceState, useAasState } from 'components/contexts/CurrentAasContext';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useRouter } from 'next/navigation';
import { RoundedIconButton } from 'components/basics/Buttons';
import { ArrowForward } from '@mui/icons-material';
import { messages } from 'lib/i18n/localization';
import { useIntl } from 'react-intl';

type DiscoveryListTableRowProps = {
    aasListEntry: IDiscoveryListEntry;
};

const tableBodyText = {
    lineHeight: '150%',
    fontSize: '16px',
    color: 'text.primary',
};
export const DiscoveryListTableRow = (props: DiscoveryListTableRowProps) => {
    const { aasListEntry } = props;
    const [, setAas] = useAasState();
    const [, setAasOriginUrl] = useAasOriginSourceState();
    const navigate = useRouter();
    const intl = useIntl();

    const navigateToAas = (aasId: string, repoUrl?: string) => {
        setAas(null);
        setAasOriginUrl(null);
        navigate.push(`/viewer/${encodeBase64(aasId)}${repoUrl ? `?repoUrl=${encodeURI(repoUrl)}` : ''}`);
    };

    return (
        <>
            <PictureTableCell />
            <TableCell align="left" sx={tableBodyText}>
                {aasListEntry.aasId}
            </TableCell>
            <TableCell align="left" sx={tableBodyText}>
                {aasListEntry.repositoryUrl ?? '-'}
            </TableCell>
            <TableCell align="center">
                <RoundedIconButton
                    endIcon={<ArrowForward />}
                    onClick={() => navigateToAas(aasListEntry.aasId, aasListEntry.repositoryUrl)}
                    title={intl.formatMessage(messages.mnestix.discoveryList.titleViewAASButton)}
                />
            </TableCell>
        </>
    );
};
