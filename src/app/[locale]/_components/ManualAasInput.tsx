import { Box, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowForward } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { SquaredIconButton } from 'components/basics/Buttons';
import { LocalizedError } from 'lib/util/LocalizedError';
import { useTranslations } from 'next-intl';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/infrastructureDatabaseActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';

export function ManualAasInput(props: {
    searchInput: (
        searchString: string,
        error_message: string,
        onErrorCallback: (error: LocalizedError) => void,
        onSuccessCallback: () => void,
        infrastructureName?: string,
    ) => Promise<void>;
}) {
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');
    const [selectedInfrastructure, setSelectedInfrastructure] = useState<string>('all');
    const [infrastructures, setInfrastructures] = useState<string[]>([]);
    const isMobile = useIsMobile();
    const inputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations();

    useEffect(() => {
        inputRef?.current?.focus();
    }, []);

    useAsyncEffect(async () => {
        const infrastructures = await getInfrastructuresIncludingDefault();
        setInfrastructures(infrastructures.map((infra) => infra.name));
    }, []);

    const setError = (msg: string) => {
        setIsError(true);
        setErrorText(msg);
    };

    const clearError = () => {
        setIsError(false);
        setErrorText('');
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const infraName = selectedInfrastructure === 'all' ? undefined : selectedInfrastructure;

        await props.searchInput(
            inputValue,
            t('navigation.errors.unexpectedError'),
            (error) => {
                setIsLoading(false);
                setError(t(error.descriptor));
            }, // onError
            () => {}, // onSuccess
            infraName,
        );
    };

    const handleKeyPress = async (event: React.KeyboardEvent) => {
        // Allow submit via enter
        if (event.key === 'Enter' && !!inputValue) {
            await handleSubmit();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        clearError();
    };

    return (
        <Box m={2} display="flex" flexDirection="column" gap={1}>
            <Typography
                variant="h5"
                sx={{
                    marginBottom: '8px',
                }}
            >
                {t('pages.dashboard.enterManuallyLabel')}
            </Typography>
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={1}>
                <TextField
                    sx={{ width: isMobile ? '100%' : '75%' }}
                    id="manual-input"
                    label={t('pages.dashboard.aasOrAssetId')}
                    error={isError}
                    helperText={errorText}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    data-testid="aasId-input"
                    autoFocus={true}
                    value={inputValue}
                    inputRef={inputRef}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => {
                                        setInputValue('');
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    select
                    variant={'filled'}
                    label={t('pages.dashboard.infrastructure')}
                    value={selectedInfrastructure || 'all'}
                    sx={{ width: isMobile ? '100%' : '25%', minWidth: 125, maxWidth: isMobile ? '100%' : 250 }}
                >
                    <MenuItem key="all" value="all" onClick={() => setSelectedInfrastructure('all')}>
                        {t('pages.dashboard.searchAllInfrastructures')}
                    </MenuItem>
                    {infrastructures.map((infrastructure) => (
                        <MenuItem
                            key={infrastructure}
                            value={infrastructure}
                            onClick={() => setSelectedInfrastructure(infrastructure)}
                        >
                            {infrastructure}
                        </MenuItem>
                    ))}
                </TextField>
                <SquaredIconButton
                    sx={{ mb: '16px', width: isMobile ? '100%' : 'auto' }}
                    endIcon={<ArrowForward />}
                    disabled={!inputValue}
                    loading={isLoading}
                    onClick={handleSubmit}
                    data-testid="aasId-submit-button"
                />
            </Box>
        </Box>
    );
}
