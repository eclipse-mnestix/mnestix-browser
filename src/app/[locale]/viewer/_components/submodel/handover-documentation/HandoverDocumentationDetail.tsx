import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { KeyTypes, SubmodelElementChoice, SubmodelElementCollection } from 'lib/api/aas/models';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { DocumentComponent } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentComponent';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { Fragment } from 'react';

const documentSemanticIds = [
    SubmodelElementSemanticIdEnum.Document,
    SubmodelElementSemanticIdEnum.DocumentIrdi,
    SubmodelElementSemanticIdEnum.DocumentIrdiV2,
];

/**
 * Collects all document collections of a Handover Documentation submodel.
 * In version 2.0 the documents are nested inside a top-level `Documents` list,
 * whereas in earlier versions they are placed directly on the submodel. This
 * helper flattens both structures so a single {@link DocumentComponent} can be
 * reused per document.
 */
function collectDocumentElements(elements: SubmodelElementChoice[] | null | undefined): SubmodelElementCollection[] {
    const documents: SubmodelElementCollection[] = [];
    for (const element of elements ?? []) {
        if (hasSemanticId(element, ...documentSemanticIds)) {
            documents.push(element as SubmodelElementCollection);
        } else if (
            element.modelType === KeyTypes.SubmodelElementList ||
            element.modelType === KeyTypes.SubmodelElementCollection
        ) {
            documents.push(...collectDocumentElements(element.value));
        }
    }
    return documents;
}

export function HandoverDocumentationDetail({ submodel, repositoryUrl }: SubmodelVisualizationProps) {
    const documents = collectDocumentElements(submodel.submodelElements);

    if (documents.length === 0) {
        return <GenericSubmodelDetailComponent submodel={submodel} repositoryUrl={repositoryUrl} />;
    }

    return (
        <>
            {documents.map((document, index) => (
                <Fragment key={index}>
                    <DocumentComponent
                        submodelElement={document}
                        submodelId={submodel.id}
                        hasDivider={index !== 0}
                        repositoryUrl={repositoryUrl}
                    />
                </Fragment>
            ))}
        </>
    );
}
