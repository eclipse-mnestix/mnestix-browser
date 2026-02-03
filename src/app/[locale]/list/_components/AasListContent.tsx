import { Box, Typography } from '@mui/material';
import AasList from './AasList';
import { AuthenticationPrompt } from 'components/authentication/AuthenticationPrompt';
import { useTranslations } from 'next-intl';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';
import { AasListDto } from 'lib/services/list-service/ListService';
import { ReactNode } from 'react';

type AasListContentProps = {
    selectedRepository: RepositoryWithInfrastructure | null | undefined;
    selectedType: 'repository' | 'registry' | undefined;
    needAuthentication: boolean;
    aasList: AasListDto | undefined;
    selectedAasList: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
    comparisonFeatureFlag: boolean;
    pagination: ReactNode;
};

export function AasListContent(props: AasListContentProps) {
    const t = useTranslations('pages.aasList');

    if (!props.selectedRepository) {
        return (
            <Box>
                <Typography data-testid="select-repository-text">{t('selectListSource')}</Typography>
            </Box>
        );
    }

    if (props.needAuthentication) {
        return <AuthenticationPrompt isDefaultRepo={props.selectedRepository?.isDefault} />;
    }

    return (
        <>
            <AasList
                data-testid="aas-list"
                repositoryUrl={props.selectedRepository}
                connectionType={props.selectedType}
                shells={props.aasList}
                selectedAasList={props.selectedAasList}
                updateSelectedAasList={props.updateSelectedAasList}
                comparisonFeatureFlag={props.comparisonFeatureFlag}
            ></AasList>
            {props.pagination}
        </>
    );
}
