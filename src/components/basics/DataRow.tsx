import { Box, Divider, Link, SxProps, Theme, Typography } from '@mui/material';
import React, { useState } from 'react';
import { OpenInNew } from '@mui/icons-material';
import { CopyButton } from './CopyButton';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';

type DataRowProps = {
    readonly title?: string | null;
    readonly value?: string;
    readonly children?: React.ReactNode;
    readonly hasDivider?: boolean;
    readonly isLink?: boolean;
    readonly sx?: SxProps<Theme>;
    readonly testId?: string;
    readonly withBase64?: boolean;
};

export function DataRow(props: DataRowProps) {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useIsMobile();
    const renderCopyButtons = () => {
        if (!props.value || isMobile) return null;
        return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CopyButton
                    value={props.value}
                    isVisible={isHovered}
                    dataTestId={props.testId || 'copy-datarow-value'}
                />
                {props.withBase64 && (
                    <CopyButton 
                        value={props.value}
                        isVisible={isHovered}
                        withBase64={true}
                        dataTestId={props.testId + '-b64' || 'copy-datarow-value-secondary'}
                    />
                )}
            </Box>
        );
    };

    return (
        <Box
            data-testid={props.testId || 'data-row'}
            sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px', ...props.sx }}
        >
            {props.hasDivider !== false && <Divider style={{ marginBottom: '10px' }} />}
            {props.title && (
                <Typography noWrap color="text.secondary" variant="body2" data-testid="data-row-title">
                    {props.title}
                </Typography>
            )}
            {props.value && (
                <Box 
                    display="flex" 
                    alignItems="center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Typography
                        style={{ overflowWrap: 'break-word', wordBreak: 'break-word', display: 'inline-block' }}
                        data-testid='data-row-value'
                    >
                        {props.isLink ? (
                            <Link component="a" href={props.value} target="_blank" rel="noopener noreferrer">
                                {props.value}
                                <OpenInNew fontSize="small" sx={{ verticalAlign: 'middle', ml: 1 }} />
                            </Link>
                        ) : (
                            props.value
                        )}
                    </Typography>
                    {renderCopyButtons()}
                </Box>
            )}
            <Box style={{ overflowWrap: 'break-word', wordBreak: 'break-word', display: 'inline-block' }}>
                {props.children}
            </Box>
        </Box>
    );
}
