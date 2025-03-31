import { Button } from '@mui/material';
import { TransferDialog } from 'app/[locale]/viewer/_components/transfer/TransferDialog';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const t = useTranslations('transfer');

export function TransferButton() {
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    
    const startTransfer = () => {
        setTransferDialogOpen(true);
    };
    
    const closeDialog = () => {
        setTransferDialogOpen(false);
    }

    return (  
        <>
            <Button variant="outlined" onClick={startTransfer} data-testid="detail-transfer-button">
                {t('title')}
            </Button>
            <TransferDialog open={transferDialogOpen} onClose={closeDialog}/>
        </>
    )
}