'use client';

import { useCallback, useEffect, useRef } from 'react';
import Scanner from 'qr-scanner';
import ScannerOutline from 'assets/ScannerOutline.svg';
import { keyframes, styled } from '@mui/system';
import { Box } from '@mui/material';

export function QrStream(props: {
    onScan: (scanResult: string) => Promise<void>;
    onLoadingFinished: (successful: boolean) => void;
}) {
    const videoEl = useRef<HTMLVideoElement>(null);
    const overlay = useRef<HTMLDivElement>(null);
    const scanner = useRef<Scanner>(null);

    const onScanSuccess = useCallback(
        async (result: Scanner.ScanResult) => {
            if (result.data && result.data.trim() !== '') {
                await props.onScan(result.data.trim());
            }
        },
        [props.onScan],
    );

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            scanner.current = new Scanner(videoEl?.current, onScanSuccess, {
                preferredCamera: 'environment',
                highlightScanRegion: true,
                overlay: overlay.current || undefined,
                maxScansPerSecond: 5,
            });

            scanner?.current
                ?.start()
                .then(() => {
                    props.onLoadingFinished(true);
                })
                .catch(() => props.onLoadingFinished(false));
        }

        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    const scale = keyframes`
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.1);
        }
    `;
    const AnimatedBox = styled(Box)`
        display: inline-block;
        padding: 10%;
        animation: ${scale} 1s infinite ease-in-out alternate;
    `;

    return (
        <>
            <video
                ref={videoEl}
                height="100%"
                width="100%"
                data-testid="scanner-video"
                style={{
                    objectFit: 'cover',
                }}
            ></video>
            <AnimatedBox ref={overlay}>
                <ScannerOutline alt="Scanner Outline" style={{ color: 'white', opacity: 0.75 }} />
            </AnimatedBox>
        </>
    );
}
