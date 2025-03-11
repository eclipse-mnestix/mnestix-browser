import { Box, Dialog, DialogContent, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';
import { MnestixLogo } from './MnestixLogo';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';

type AboutDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
};

export function AboutDialog(props: AboutDialogProps) {
    const t = useTranslations('footer');
    const theme = useTheme();
    const isMobile = useIsMobile();

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth={true}>
            <IconButton
                aria-label="close"
                onClick={props.onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent style={{ padding: '40px' }}>
                <Box display="flex" flexDirection="column" gap="20px">
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <Typography variant="h2" color={'primary'}>
                            {t('about')}
                            <Typography>MIT License</Typography>
                            <Typography>Copyright (c) 2024 XITASO GmbH</Typography>
                        </Typography>
                        </Box>
                        {!isMobile && (
                            <Box
                                bgcolor={theme.palette.primary.main}
                                borderRadius={'0.5rem'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                display={'flex'}
                                p={'1rem'}
                                m={'0.5rem'}
                                mr={'1rem'}
                            >
                                <MnestixLogo width={'15rem'} />
                            </Box>
                        )}
                    </Box>
                    <Box>
                        <Typography color="text.secondary">
                            Permission is hereby granted, free of charge, to any person obtaining a copy of this
                            software and associated documentation files (the &quot;Software&quot;), to deal in the
                            Software without restriction, including without limitation the rights to use, copy, modify,
                            merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
                            persons to whom the Software is furnished to do so, subject to the following conditions:
                            <br />
                            <br />
                            The above copyright notice and this permission notice shall be included in all copies or
                            substantial portions of the Software.
                            <br />
                            <br />
                            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                            PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
                            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
                            OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
                            DEALINGS IN THE SOFTWARE.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
