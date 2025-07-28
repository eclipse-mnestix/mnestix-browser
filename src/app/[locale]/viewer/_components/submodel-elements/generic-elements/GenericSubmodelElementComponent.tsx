import { Typography } from '@mui/material';
import { GenericPropertyComponent } from './GenericPropertyComponent';
import { SubmodelElementCollectionComponent } from './SubmodelElementCollectionComponent';
import { DataRow } from 'components/basics/DataRow';
import { FileComponent } from './FileComponent';
import { MultiLanguagePropertyComponent } from './MultiLanguagePropertyComponent';
import { KeyTypes } from 'lib/api/aas/models';
import { EntityComponent } from './entity-components/EntityComponent';
import { buildSubmodelElementPath } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementComponentProps } from '../SubmodelElementComponentProps';
import { useTranslations } from 'next-intl';

type GenericSubmodelElementComponentProps = SubmodelElementComponentProps & {
    readonly submodelElementPath?: string | null;
    readonly wrapInDataRow?: boolean;
    readonly repositoryUrl?: string;
};

export function GenericSubmodelElementComponent(props: GenericSubmodelElementComponentProps) {
    const t = useTranslations('pages.aasViewer.submodels');

    function getRenderElement() {
        if (!props.submodelElement) {
            return;
        }
        /**
         * We trust that modelType gives us enough information
         * to map the submodelElement interface from our api client to specific types
         */
        switch (props.submodelElement.modelType) {
            case KeyTypes.Property:
                return <GenericPropertyComponent property={props.submodelElement} withCopyButton={true} />;
            case KeyTypes.SubmodelElementCollection:
            case KeyTypes.SubmodelElementList:
                return (
                    <SubmodelElementCollectionComponent
                        submodelElementCollection={props.submodelElement}
                        submodelId={props.submodelId}
                        submodelElementPath={buildSubmodelElementPath(
                            props.submodelElementPath,
                            props.submodelElement.idShort,
                        )}
                    />
                );
            case KeyTypes.File:
                return (
                    <FileComponent
                        file={props.submodelElement}
                        submodelId={props.submodelId}
                        submodelElementPath={buildSubmodelElementPath(
                            props.submodelElementPath,
                            props.submodelElement.idShort,
                        )}
                        repositoryUrl={props.repositoryUrl}
                    />
                );
            case KeyTypes.MultiLanguageProperty:
                return <MultiLanguagePropertyComponent mLangProp={props.submodelElement} />;
            case KeyTypes.Entity:
                return <EntityComponent entity={props.submodelElement} />;
            default:
                return (
                    <Typography color="error" variant="body2">
                        {t('unknownModelType', { type: `${props.submodelElement.modelType}` })}
                    </Typography>
                );
        }
    }

    return props.wrapInDataRow !== false ? (
        <DataRow title={props.submodelElement?.idShort} hasDivider={props.hasDivider}>
            {getRenderElement()}
        </DataRow>
    ) : (
        <>{getRenderElement()}</>
    );
}
