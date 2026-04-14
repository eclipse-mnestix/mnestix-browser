import { SubmodelElementCollection, SubmodelElementList } from 'lib/api/aas/models';
import { DocumentComponent } from './DocumentComponent';
import { CustomSubmodelElementComponentProps } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';

export function DocumentsListComponent(props: CustomSubmodelElementComponentProps) {
    const list = props.submodelElement as SubmodelElementList;
    const documents = (list.value ?? []) as SubmodelElementCollection[];

    return (
        <>
            {documents.map((document, index) => (
                <DocumentComponent
                    key={index}
                    submodelElement={document}
                    submodelId={props.submodelId}
                    hasDivider={index !== 0}
                    repositoryUrl={props.repositoryUrl}
                    documentIndex={index}
                    parentListIdShort={list.idShort ?? 'Documents'}
                />
            ))}
        </>
    );
}
