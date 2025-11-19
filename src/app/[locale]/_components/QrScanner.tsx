'use client';

import { useCallback, useEffect, useState } from 'react';
import ScannerLogo from 'assets/ScannerLogo.svg';
import ScannerOutlineThin from 'assets/ScannerOutlineThin.svg';
import { Box, CircularProgress, IconButton, Typography, useTheme } from '@mui/material';
import { QrStream } from 'app/[locale]/_components/QrStream';
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizedError } from 'lib/util/LocalizedError';
import { keyframes, styled } from '@mui/system';
import { ThemeProvider } from '@mui/material/styles';
import CircleIcon from '@mui/icons-material/Circle';
import { useShowError } from 'lib/hooks/UseShowError';
import { useTranslations } from 'next-intl';

enum State {
    Stopped,
    LoadScanner,
    ShowVideo,
    HandleQr,
}

const expandFromCenter = keyframes`
    0% {
        width: 0;
        left: 50%;
    }
    100% {
        width: 100%;
        left: 0;
    }
`;

const VideoContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'focused',
})<{ focused: boolean; size: number }>(({ theme, focused, size }) => ({
    position: 'relative',
    display: 'inline-block',
    outline: 'none',
    '& video': {
        display: 'block',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        width: size,
        height: size,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 4,
        backgroundColor: theme.palette.primary.main,
        transition: 'background-color 0.3s ease-in-out',
        animation: focused ? `${expandFromCenter} 0.25s forwards` : 'none',
    },
}));

export function QrScanner(props: {
    searchInput: (
        searchString: string,
        error_message: string,
        onErrorCallback: (error: LocalizedError) => void,
        onSuccessCallback: () => void,
        infrastructureName?: string,
    ) => Promise<void>;
    size?: number | undefined;
}) {
    const { searchInput } = props;
    const [state, setState] = useState<State>(State.Stopped);
    const t = useTranslations();
    const { showError } = useShowError();

    const theme = useTheme();
    const size = props.size || 250;

    const switchToVideoStream = useCallback(
        function switchToVideoStream(loadingSuccessful: boolean) {
            if (loadingSuccessful) {
                setState(State.ShowVideo);
            } else {
                showError(new LocalizedError('components.qrScanner.errors.errorOnQrScannerOpen'));
                setState(State.Stopped);
            }
        },
        [showError],
    );

    const handleScan = useCallback(
        async function handleScan(result: string) {
            setState(State.HandleQr);
            await searchInput(
                result,
                t('components.qrScanner.errors.defaultCallbackErrorMsg'),
                (_error) => setState(State.LoadScanner), //onError
                () => setState(State.Stopped), //onSuccess
            );
        },
        [searchInput, t],
    );

    // This will allow cypress to call the callback manually and circumvent a webcam mock
    useEffect(() => {
        if (typeof window !== 'undefined' && typeof window.Cypress !== 'undefined') {
            window.Cypress.scannerCallback = handleScan;
        }
    }, [handleScan]);

    return (
        <Box
            position="relative"
            margin="auto"
            height={size}
            width={size}
            style={{ cursor: 'pointer', backgroundColor: theme.palette.primary.main }}
        >
            {state === State.Stopped && (
                <Box
                    onClick={() => setState(State.LoadScanner)}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height={size}
                    width={size}
                    gap={1}
                    color="white"
                    data-testid="scanner-start"
                >
                    <ScannerLogo alt="Scanner Logo" width="50px" />
                    <Typography variant="h2">Scan Code</Typography>
                    <Box position="absolute">
                        <ScannerOutlineThin></ScannerOutlineThin>
                    </Box>
                </Box>
            )}
            {state === State.ShowVideo && (
                <IconButton
                    data-testid="scanner-close-button"
                    aria-label="close scanner"
                    onClick={() => setState(State.Stopped)}
                    style={{
                        position: 'absolute',
                        zIndex: 995,
                        right: 0,
                    }}
                >
                    <CircleIcon fontSize="medium" style={{ color: 'white', position: 'absolute', zIndex: 993 }} />
                    <CancelIcon fontSize="large" color="primary" style={{ zIndex: 994 }} />
                </IconButton>
            )}
            {(state === State.LoadScanner || state === State.HandleQr) && (
                <Box padding="50px" position="absolute" height={size} width={size}>
                    <CircularProgress
                        style={{ margin: 'auto', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                    />
                    <ScannerLogo style={{ color: theme.palette.primary.main, opacity: 0.4 }} alt="Scanner Logo" />
                </Box>
            )}
            {(state === State.LoadScanner || state === State.ShowVideo) && (
                <ThemeProvider theme={theme}>
                    <VideoContainer focused={state === State.ShowVideo} size={size} tabIndex={0}>
                        <QrStream onScan={handleScan} onLoadingFinished={switchToVideoStream} />
                    </VideoContainer>
                </ThemeProvider>
            )}
        </Box>
    );
}
