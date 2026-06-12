'use client';

import { Box, Button, TextField, Typography, CircularProgress, Alert, Pagination } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { searchCompaniesByName } from 'lib/services/company-lookup-service/companyLookupActions';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';
import { CompanyCard } from 'app/[locale]/settings/company-lookup/_components/CompanyCard';

const ITEMS_PER_PAGE = 10;

/**
 * Main view component for company lookup functionality
 */
export function CompanyLookupView() {
    const t = useTranslations('pages.settings.companyLookup');
    const router = useRouter();
    const notificationSpawner = useNotificationSpawner();

    const [searchInput, setSearchInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [allResults, setAllResults] = useState<Company[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [addedCompanies, setAddedCompanies] = useState<Set<string>>(new Set());
    const [hasError, setHasError] = useState<boolean>(false);

    // Load all companies on mount
    useEffect(() => {
        const loadAllCompanies = async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await searchCompaniesByName('');
                if (response.isSuccess) {
                    setAllResults(response.result);
                } else {
                    setHasError(true);
                    notificationSpawner.spawn({
                        message: t('searchError'),
                        severity: 'error',
                    });
                }
            } catch (error) {
                setHasError(true);
                notificationSpawner.spawn({
                    message: t('searchError'),
                    severity: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadAllCompanies();
    }, []);

    const handleSearch = async () => {
        if (!searchInput.trim()) {
            // If search is cleared, reload all companies
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await searchCompaniesByName('');
                if (response.isSuccess) {
                    setAllResults(response.result);
                    setCurrentPage(1);
                } else {
                    setHasError(true);
                }
            } catch (error) {
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        setIsLoading(true);
        setHasError(false);

        try {
            const response = await searchCompaniesByName(searchInput.trim());

            if (response.isSuccess) {
                setAllResults(response.result);
                setCurrentPage(1);
                if (response.result.length === 0) {
                    notificationSpawner.spawn({
                        message: t('noResults'),
                        severity: 'info',
                    });
                }
            } else {
                setHasError(true);
                notificationSpawner.spawn({
                    message: t('searchError'),
                    severity: 'error',
                });
            }
        } catch (error) {
            setHasError(true);
            notificationSpawner.spawn({
                message: t('searchError'),
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCompanyAdded = (companyName: string) => {
        setAddedCompanies((prev) => new Set([...prev, companyName]));
        notificationSpawner.spawn({
            message: t('addSuccess'),
            severity: 'success',
        });
    };

    const handleCompanyAddError = () => {
        notificationSpawner.spawn({
            message: t('addError'),
            severity: 'error',
        });
    };

    // Pagination logic
    const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedCompanies = allResults.slice(startIndex, endIndex);

    return (
        <Box sx={{ p: 3, maxWidth: 900 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Button startIcon={<ArrowBack />} onClick={() => router.push('/settings')} variant="text">
                    {t('backButton')}
                </Button>
                <Typography variant="h4">{t('title')}</Typography>
            </Box>

            {/* Subtitle */}
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                {t('subtitle')}
            </Typography>

            {/* Search Box */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder={t('searchPlaceholder')}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    size="small"
                    variant="outlined"
                />
                <Button onClick={handleSearch} disabled={isLoading} variant="contained" sx={{ minWidth: 120 }}>
                    {isLoading ? <CircularProgress size={24} /> : t('searchButton')}
                </Button>
            </Box>

            {/* Loading State */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Error State */}
            {hasError && !isLoading && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {t('searchError')}
                </Alert>
            )}

            {/* No Results */}
            {!isLoading && !hasError && allResults.length === 0 && <Alert severity="info">{t('noResults')}</Alert>}

            {/* Results */}
            {!isLoading && !hasError && allResults.length > 0 && (
                <>
                    {/* Results Info */}
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        {searchInput.trim() ? (
                            <>
                                {allResults.length} {allResults.length === 1 ? 'result' : 'results'} found
                            </>
                        ) : (
                            <>{allResults.length} companies available</>
                        )}
                    </Typography>

                    {/* Company Cards */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        {displayedCompanies.map((company) => (
                            <CompanyCard
                                key={company.name}
                                company={company}
                                isAdded={addedCompanies.has(company.name)}
                                onAdded={() => handleCompanyAdded(company.name)}
                                onAddError={handleCompanyAddError}
                            />
                        ))}
                    </Box>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(_, newPage) => setCurrentPage(newPage)}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}
