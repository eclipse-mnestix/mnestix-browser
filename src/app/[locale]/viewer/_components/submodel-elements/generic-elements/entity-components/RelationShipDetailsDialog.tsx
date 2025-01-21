import { Dialog, DialogContent, Typography } from '@mui/material';
import { Reference, RelationshipElement, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { useEffect, useState } from 'react';
import { useShowError } from 'lib/hooks/UseShowError';
import { useParams } from 'next/navigation';
import { useEnv } from 'app/env/provider';
import {
    getSubmodelById,
    getSubmodelReferencesFromShell,
} from 'lib/services/repository-access/repositorySearchActions';
import { getSubmodelDescriptorsById } from 'lib/services/submodelRegistryApiActions';

type RelationShipDetailsModalProps = {
    readonly relationship: RelationshipElement;
    readonly handleClose: () => void;
    readonly open: boolean;
};

export function RelationShipDetailsDialog(props: RelationShipDetailsModalProps) {
    const relationship = props.relationship;
    const searchParams = useParams<{ base64AasId: string }>();
    const base64AasId = searchParams.base64AasId;

    const submodelId = relationship.second.keys[0]?.value;

    const [subIdShort, setSubIdShort] = useState<string>();
    const env = useEnv();
    const { showError } = useShowError();

    useEffect(() => {
        async function _fetchSubmodels() {
            try {
                const response = await getSubmodelReferencesFromShell(base64AasId as string);
                let submodelRefs: Reference[];
                if (response.isSuccess) submodelRefs = response.result;
                else throw Error(response.message);
                const submodels = [] as Submodel[];
                for (const reference of submodelRefs) {
                    const id = reference.keys[0].value;
                    try {
                        if (env.SUBMODEL_REGISTRY_API_URL) {
                            const response = await getSubmodelDescriptorsById(reference.keys[0].value);
                            if (response.isSuccess) {
                                if (response.result.id) {
                                    const submodelResult = await getSubmodelById(response.result.id);
                                    if (submodelResult.isSuccess) submodels.push(submodelResult.result);
                                }
                            } else throw new Error(response.message);
                        }
                    } catch (e) {
                        // Submodel registry is not available or submodel not found there -> search in repo
                        if (e instanceof TypeError || (e instanceof Response && e.status === 404)) {
                            const submodelResult = await getSubmodelById(id);
                            if (submodelResult.isSuccess) submodels.push(submodelResult.result);
                        } else {
                            console.error(e);
                        }
                    }
                }

                const submodel = submodels.find((sm) => {
                    return sm.id === submodelId;
                });
                const submodelIdShort = submodel?.idShort;
                setSubIdShort(submodelIdShort as string);
            } catch (e) {
                showError(e);
            }
        }

        _fetchSubmodels();
    }, [base64AasId, submodelId]);

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent data-testid="bom-info-popup">
                <Typography variant="h3" sx={{ mb: 2 }}>
                    {relationship.idShort}
                </Typography>
                <DataRow title="Same entity submodel - idShort" hasDivider={false}>
                    {subIdShort || <FormattedMessage {...messages.mnestix.notAvailable} />}
                </DataRow>
                <DataRow title="Same Entity" hasDivider={false}>
                    {relationship.second.keys[relationship.second.keys.length - 1]?.value || (
                        <FormattedMessage {...messages.mnestix.notAvailable} />
                    )}
                </DataRow>
            </DialogContent>
        </Dialog>
    );
}
