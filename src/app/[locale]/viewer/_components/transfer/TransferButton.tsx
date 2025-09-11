import { Button } from '@mui/material';
import { TransferDialog } from 'app/[locale]/viewer/_components/transfer/TransferDialog';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function TransferButton() {
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const t = useTranslations('pages');

    const startTransfer = () => {
        setTransferDialogOpen(true);
    };

    const closeDialog = () => {
        setTransferDialogOpen(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                sx={{
                    whiteSpace: 'nowrap',
                    ml: 2,
                    minWidth: 'auto',
                    padding: '6px 16px',
                }}
                onClick={startTransfer}
                data-testid="detail-transfer-button"
            >
                {t('transfer.title')}
            </Button>
            <TransferDialog open={transferDialogOpen} onClose={closeDialog} />
        </>
    );
}
