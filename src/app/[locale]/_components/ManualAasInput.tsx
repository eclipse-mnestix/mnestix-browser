import { Box, IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowForward } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { SquaredIconButton } from 'components/basics/Buttons';
import { LocalizedError } from 'lib/util/LocalizedError';
import { useShowError } from 'lib/hooks/UseShowError';
import { useTranslations } from 'next-intl';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/connectionServerActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';

export function ManualAasInput(props: { onSubmit: (input: string, infrastructureName?: string) => Promise<void> }) {
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');
    const [selectedInfrastructure, setSelectedInfrastructure] = useState<string>('all');
    const [infrastructures, setInfrastructures] = useState<string[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const { showError } = useShowError();
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
        try {
            setIsLoading(true);
            const infraName = selectedInfrastructure === 'all' ? undefined : selectedInfrastructure;

            await props.onSubmit(inputValue, infraName);
        } catch (e) {
            setIsLoading(false);
            const msg = e instanceof LocalizedError ? e.descriptor : 'navigation.errors.unexpectedError';
            setError(t(msg));
            if (!(e instanceof LocalizedError)) showError(e);
        }
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
        <Box display="flex" justifyContent="center">
            <TextField
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
                variant={'outlined'}
                label={t('pages.dashboard.infrastructure')}
                value={selectedInfrastructure || 'all'}
                sx={{ ml: 1, width: 200 }}
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
                sx={{ ml: 1 }}
                endIcon={<ArrowForward />}
                disabled={!inputValue}
                loading={isLoading}
                onClick={handleSubmit}
                data-testid="aasId-submit-button"
            />
        </Box>
    );
}
