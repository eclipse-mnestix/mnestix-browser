'use client';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
    CircularProgress,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import React, { useState } from 'react';
import { Check } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';
import {
    mapEndpointInterfaceToConnectionType,
    mapCompanyToInfrastructureFormDataWithSelected,
} from 'lib/services/company-lookup-service/companyEndpointMapper';
import { createInfrastructureAction } from 'lib/services/database/infrastructureDatabaseActions';

interface CompanyCardProps {
    company: Company;
    isAdded: boolean;
    onAdded: () => void;
    onAddError: (errorMessage?: string) => void;
}

/**
 * Component to display a company and allow adding selected endpoints as infrastructure
 */
export function CompanyCard({ company, isAdded, onAdded, onAddError }: CompanyCardProps) {
    const t = useTranslations('pages.settings.companyLookup');
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [selectedEndpoints, setSelectedEndpoints] = useState<Set<string>>(
        new Set(company.endpoints.map((ep) => ep.protocolInformation.href)),
    );

    const handleAddAsInfrastructure = async () => {
        setIsAdding(true);
        try {
            const infrastructureData = mapCompanyToInfrastructureFormDataWithSelected(
                company,
                Array.from(selectedEndpoints),
            );
            await createInfrastructureAction(infrastructureData);
            onAdded();
        } catch (error) {
            let errorMessage: string | undefined;
            if (error instanceof Error) {
                const errorMsg = error.message || '';
                // Check for unique constraint violation (duplicate name)
                if (errorMsg.includes('Unique constraint') || errorMsg.includes('unique')) {
                    errorMessage = t('addErrorDuplicate');
                }
            }
            onAddError(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const handleEndpointToggle = (url: string) => {
        setSelectedEndpoints((prev) => {
            const updated = new Set(prev);
            if (updated.has(url)) {
                updated.delete(url);
            } else {
                updated.add(url);
            }
            return updated;
        });
    };

    const getConnectionType = (interfaceType: string): string | null => {
        return mapEndpointInterfaceToConnectionType(interfaceType);
    };

    return (
        <Card sx={{ borderRadius: 1 }}>
            <CardContent>
                {/* Company Name and Domain */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {company.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('domain')}: {company.domain}
                        </Typography>
                    </Box>
                </Box>

                {/* Endpoints List */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
                        {t('endpoints')} ({selectedEndpoints.size}/{company.endpoints.length})
                    </Typography>
                    <Stack spacing={1}>
                        {company.endpoints.map((endpoint) => {
                            const connectionType = getConnectionType(endpoint.interface);
                            const isSupported = connectionType !== null;

                            return (
                                <FormControlLabel
                                    key={endpoint.protocolInformation.href}
                                    control={
                                        <Checkbox
                                            checked={selectedEndpoints.has(endpoint.protocolInformation.href)}
                                            onChange={() => handleEndpointToggle(endpoint.protocolInformation.href)}
                                            disabled={!isSupported}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                {endpoint.protocolInformation.href}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {isSupported
                                                    ? connectionType
                                                    : '(Unsupported: ' + endpoint.interface + ')'}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        opacity: isSupported ? 1 : 0.6,
                                        '.MuiFormControlLabel-label': {
                                            width: '100%',
                                        },
                                    }}
                                />
                            );
                        })}
                    </Stack>
                </Box>

                {/* Add Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant={isAdded ? 'outlined' : 'contained'}
                        onClick={handleAddAsInfrastructure}
                        disabled={isAdded || isAdding || selectedEndpoints.size === 0}
                        startIcon={isAdded ? <Check /> : undefined}
                        sx={{ minWidth: 180 }}
                    >
                        {isAdding ? (
                            <CircularProgress size={20} />
                        ) : isAdded ? (
                            t('addedButton')
                        ) : (
                            `${t('addButton')} (${selectedEndpoints.size})`
                        )}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
