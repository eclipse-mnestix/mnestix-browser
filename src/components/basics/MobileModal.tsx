import { Box, IconButton, Modal, Slide, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { SubmodelInfoTooltip, TabSelectorItem } from 'components/basics/VerticalTabSelector';

type MobileModalProps = {
    readonly selectedItem?: TabSelectorItem;
    readonly content: React.ReactNode;
    readonly handleClose: () => void;
    readonly setInfoItem: (infoItem: TabSelectorItem) => void;
    readonly open: boolean;
};

export function MobileModal(props: MobileModalProps) {
    const modalStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'white',
    };

    const headerStyle = {
        display: 'flex',
        background: 'white',
        position: 'fixed',
        alignItems: 'center',
        width: '100%',
        height: '52px',
        boxShadow: '2',
        justifyContent: 'space-between',
        padding: '20px 10px 20px 20px',
    };

    const contentWrapperStyle = {
        overflow: 'auto',
        height: '100%',
        marginTop: '55px',
        padding: '20px 20px 100px 20px',
    };

    return (
        <Modal open={props.open}>
            <Slide direction="up" in={props.open} mountOnEnter unmountOnExit>
                <Box sx={modalStyle} width="100%">
                    <Box sx={headerStyle}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h3" sx={{ pr: '0.5rem' }}>
                                {props.selectedItem?.label || ''}
                            </Typography>
                            {!!props.selectedItem && (
                                <SubmodelInfoTooltip item={props.selectedItem} setInfoItem={props.setInfoItem} />
                            )}
                        </Box>
                        <IconButton onClick={props.handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={contentWrapperStyle}>{props.content}</Box>
                </Box>
            </Slide>
        </Modal>
    );
}
