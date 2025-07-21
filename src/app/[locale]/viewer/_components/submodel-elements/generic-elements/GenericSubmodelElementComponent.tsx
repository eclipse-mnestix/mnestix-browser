import { Typography } from '@mui/material';
import { GenericPropertyComponent } from './GenericPropertyComponent';
import { SubmodelElementCollectionComponent } from './SubmodelElementCollectionComponent';
import { DataRow } from 'components/basics/DataRow';
import { FileComponent } from './FileComponent';
import { MultiLanguagePropertyComponent } from './MultiLanguagePropertyComponent';
import {
    Entity,
    File,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    ReferenceElement,
    RelationshipElement,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { EntityComponent } from './entity-components/EntityComponent';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { buildSubmodelElementPath } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementComponentProps } from '../SubmodelElementComponentProps';
import { useTranslations } from 'next-intl';
import { ReferenceElementComponent } from './ReferenceElementComponent';
import { RelationshipElementComponent } from './RelationshipElementComponent';

type GenericSubmodelElementComponentProps = SubmodelElementComponentProps & {
    readonly submodelElementPath?: string | null;
    readonly wrapInDataRow?: boolean;
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
        const submodelElementType = getKeyType(props.submodelElement);

        switch (submodelElementType) {
            case KeyTypes.Property:
                return <GenericPropertyComponent property={props.submodelElement as Property} withCopyButton={true} />;
            case KeyTypes.SubmodelElementCollection:
            case KeyTypes.SubmodelElementList:
                return (
                    <SubmodelElementCollectionComponent
                        submodelElementCollection={props.submodelElement as SubmodelElementCollection}
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
                        file={props.submodelElement as File}
                        submodelId={props.submodelId}
                        submodelElementPath={buildSubmodelElementPath(
                            props.submodelElementPath,
                            props.submodelElement.idShort,
                        )}
                    />
                );
            case KeyTypes.MultiLanguageProperty:
                return <MultiLanguagePropertyComponent mLangProp={props.submodelElement as MultiLanguageProperty} />;
            case KeyTypes.Entity:
                return <EntityComponent entity={props.submodelElement as Entity} />;
            case KeyTypes.ReferenceElement:
                return <ReferenceElementComponent refElement={props.submodelElement as ReferenceElement} />;
            case KeyTypes.RelationshipElement:
                return <RelationshipElementComponent relElement={props.submodelElement as RelationshipElement} />;
            default:
                return (
                    <Typography color="error" variant="body2">
                        {t('unknownModelType', { type: `${submodelElementType}` })}
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
