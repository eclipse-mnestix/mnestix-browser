import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React from 'react';
import { File } from '@aas-core-works/aas-core3.0-typescript/types';
import { FileComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/FileComponent';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Props for the ImagePreviewDialog component
 */
interface ImagePreviewDialogProps {
    /**
     * Whether the dialog is open
     */
    open: boolean;
    /**
     * Function to handle closing the dialog
     */
    onClose: () => void;
    /**
     * The file to display in the preview
     */
    file: File | null;
    /**
     * The ID of the submodel containing the file
     */
    submodelId?: string;
    /**
     * The path to the submodel element
     */
    submodelElementPath: string | null;
}

/**
 * A dialog component for previewing images from FileComponent
 */
function ImagePreviewDialog({ open, onClose, file, submodelId, submodelElementPath }: ImagePreviewDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="image-preview-dialog-title"
        >
            <DialogTitle
                id="image-preview-dialog-title"
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                {file?.idShort || 'Image Preview'}
                <IconButton
                    onClick={onClose}
                    edge="end"
                    aria-label="close"
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', p: 2 }}>
                {file && submodelElementPath && (
                    <Box sx={{ maxWidth: '100%', maxHeight: '80vh', minHeight: '100px' }}>
                        <FileComponent
                            file={file}
                            submodelId={submodelId}
                            submodelElementPath={submodelElementPath}
                            withPreviewDialog={false}
                        />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ImagePreviewDialog;
