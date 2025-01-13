import {
    Entity,
    EntityType,
    ISubmodelElement,
    KeyTypes,
    Property,
    RelationshipElement,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { EntityComponent } from '../../submodel-elements/generic-elements/entity-components/EntityComponent';
import { cloneDeep } from 'lodash';
import { SubmodelElementSemanticId } from 'lib/enums/SubmodelElementSemanticId.enum';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { GetEntityType } from 'lib/util/EntityTypeUtil';
import { Box, IconButton } from '@mui/material';
import { GenericSubmodelElementComponent } from '../../submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { InfoOutlined } from '@mui/icons-material';
import React from 'react';
import { ArchetypeDetailsDialog } from './ArchetypeDetailsDialog';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function HierarchicalStructuresDetail({ submodel }: SubmodelVisualizationProps) {
    const submodelElements = submodel.submodelElements as ISubmodelElement[];

    const isSubmodelFlattened = checkSubmodelsElements(submodelElements);

    const smElements = cloneDeep(submodelElements);

    if (isSubmodelFlattened) separateEntryNode(smElements as Entity[]);

    const entitySubmodelElement = smElements.find((el) => {
        if (getKeyType(el) === KeyTypes.Entity) {
            return el as Entity;
        }
        return;
    });

    const archeTypePropertylElement = smElements.find((el) => {
        if (
            getKeyType(el) === KeyTypes.Property &&
            el.semanticId?.keys[0].value === SubmodelElementSemanticId.ArcheType
        ) {
            return el as Property;
        }
        return;
    });

    const [entryNode, relationShips, entityNodes] = prepareEntryNodeModel(entitySubmodelElement);

    (entryNode as Entity).statements = buildRelationTree(
        entryNode as Entity,
        relationShips as RelationshipElement[],
        entityNodes as Entity[],
    );
    const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };
    const handleDetailsClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        setDetailsModalOpen(true);
    };

    return (
        <Box width="100%">
            <EntityComponent entity={entryNode as Entity} />

            {archeTypePropertylElement && (
                <>
                    <Box sx={{ mt: 2, display: 'flex' }}>
                        <GenericSubmodelElementComponent
                            key={archeTypePropertylElement.idShort}
                            submodelId={submodel.id}
                            submodelElement={archeTypePropertylElement}
                            hasDivider={false}
                        />

                        <Box sx={{ ml: '2px', pl: 1, display: 'flex', height: '50%' }}>
                            <IconButton sx={{ mr: 1 }} onClick={handleDetailsClick}>
                                <InfoOutlined data-testid="entity-info-icon" sx={{ color: 'text.secondary' }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <ArchetypeDetailsDialog open={detailsModalOpen} handleClose={handleDetailsModalClose} />
                </>
            )}
        </Box>
    );
}

const prepareEntryNodeModel = (subMod?: ISubmodelElement) => {
    const node = subMod as Entity;

    const relationShips: ISubmodelElement[] = [];
    const entityNodes: Entity[] = [];

    node?.statements?.forEach((el) => {
        const elementEntity = el as Entity;
        const elementType = getKeyType(elementEntity);
        if (elementType === KeyTypes.RelationshipElement) {
            relationShips.push(elementEntity);
        }

        if (elementType === KeyTypes.Entity) {
            if (elementEntity.statements?.length) {
                const [, relationShipsElements, entityNodesElements] = prepareEntryNodeModel(el as Entity);
                relationShips.push(...(relationShipsElements as ISubmodelElement[]));
                entityNodes.push(...(entityNodesElements as Entity[]));
            }

            for (let i = (elementEntity.statements as ISubmodelElement[])?.length - 1; i >= 0; --i) {
                const entity = (elementEntity.statements as ISubmodelElement[])[i];
                const entityType = GetEntityType(elementEntity);
                const keyType = getKeyType(entity);

                if (isBulkCountProperty(entity)) {
                    elementEntity.idShort = elementEntity.idShort + ' x' + (entity as Property).value;
                }

                if (
                    isBulkCountProperty(entity) ||
                    (entityType === EntityType.SelfManagedEntity && keyType !== KeyTypes.Property)
                ) {
                    elementEntity.statements?.splice(i, 1);
                }
            }

            // If the entity has no statements defined, we create them, so we can push the relationships into it later on
            if (!elementEntity.statements) elementEntity.statements = [];

            entityNodes.push(elementEntity);
        }
    });

    return [node, relationShips, entityNodes];
};

const buildRelationTree = (entryNode: Entity, relationShips: RelationshipElement[], entityNodes: Entity[]) => {
    relationShips.forEach((rel) => {
        selectRelationship(entryNode, rel, entityNodes);
    });

    return entityNodes;
};

const selectRelationship = (entryNode: Entity, relationShips: RelationshipElement, entityNodes: Entity[]) => {
    switch (relationShips.semanticId?.keys[0].value) {
        case RelationShipTypes.SameAs:
            return (entityNodes = buildSameAsRelationship(entryNode, relationShips, entityNodes));
        case RelationShipTypes.IsPartOf:
            return (entityNodes = buildIsPartOfRelationship(entryNode, relationShips, entityNodes));
        case RelationShipTypes.HasPart:
            return (entityNodes = buildHasPartRelationship(entryNode, relationShips, entityNodes));
        default:
            return entityNodes;
    }
};

enum RelationShipTypes {
    SameAs = 'https://admin-shell.io/idta/HierarchicalStructures/SameAs/1/0',
    IsPartOf = 'https://admin-shell.io/idta/HierarchicalStructures/IsPartOf/1/0',
    HasPart = 'https://admin-shell.io/idta/HierarchicalStructures/HasPart/1/0',
}

function buildSameAsRelationship(entryNode: Entity, rel: RelationshipElement, entityNodes: Entity[]) {
    const entityName = rel.first.keys[rel.first.keys.length - 1]?.value;

    const entity = findEntity(entityNodes, entityName);
    entity?.statements?.push(rel);

    rel.idShort = 'SameAs Relationship for: ' + entityName;

    return entityNodes;
}

function buildIsPartOfRelationship(entryNode: Entity, rel: RelationshipElement, entityNodes: Entity[]) {
    const firstEntityName = rel.first.keys[rel.first.keys.length - 1]?.value;
    const secondEntityName = rel.second.keys[rel.second.keys.length - 1]?.value;

    if (secondEntityName === entryNode.idShort) return entityNodes;

    const firstEntity = findEntity(entityNodes, firstEntityName);

    const secondEntity = findEntity(entityNodes, secondEntityName);

    secondEntity?.statements?.push(firstEntity as Entity);

    const index = entityNodes.indexOf(firstEntity as Entity);
    if (index > -1) entityNodes.splice(index, 1);

    return entityNodes;
}

function buildHasPartRelationship(entryNode: Entity, rel: RelationshipElement, entityNodes: Entity[]) {
    const firstEntityName = rel.first.keys[rel.first.keys.length - 1]?.value;
    const secondEntityName = rel.second.keys[rel.second.keys.length - 1]?.value;

    if (firstEntityName === entryNode.idShort) return entityNodes;

    const firstEntity = findEntity(entityNodes, firstEntityName);

    const secondEntity = findEntity(entityNodes, secondEntityName);

    firstEntity?.statements?.push(secondEntity as Entity);

    const index = entityNodes.indexOf(secondEntity as Entity);
    if (index > -1) entityNodes.splice(index, 1);

    return entityNodes;
}

function findEntity(entityNodes: Entity[], entityName: string): Entity {
    const foundEntities: Entity[] = [];

    if (entityNodes !== undefined && entityNodes.length > 0) {
        entityNodes.forEach((ent) => {
            const splitter = ' x';
            const indexOf = ent?.idShort?.indexOf(splitter);
            let idShortToCompare: string;
            if (indexOf != -1) {
                idShortToCompare = ent?.idShort?.substring(0, indexOf) as string;
            } else {
                idShortToCompare = ent?.idShort as string;
            }
            if (foundEntities.length < 1) {
                if (idShortToCompare === entityName) {
                    foundEntities.push(ent);
                } else {
                    const found = findEntity(ent?.statements as Entity[], entityName);
                    if (found !== undefined) foundEntities.push(found);
                }
            }
        });
    }

    const foundEntity = foundEntities[0];

    return foundEntity as Entity;
}

function checkSubmodelsElements(smElements: ISubmodelElement[]) {
    const foundElements: ISubmodelElement[] = [];

    for (let i = 0; i < smElements.length; ++i) {
        const smElementType = getKeyType(smElements[i]);
        if (smElementType === KeyTypes.Entity) foundElements.push(smElements[i] as ISubmodelElement);

        if (foundElements.length > 1) return true;
    }

    return false;
}

function separateEntryNode(smElements: Entity[]) {
    const entryNode = smElements.find((el) => {
        return el.semanticId?.keys[0].value === SubmodelElementSemanticId.EntryNode;
    });

    const indexOfEntryNode = smElements.indexOf(entryNode as Entity);

    smElements.splice(indexOfEntryNode, 1);

    for (let i = smElements.length - 1; i >= 0; --i) {
        const smElementType = getKeyType(smElements[i]);
        if (smElementType === KeyTypes.Entity || smElementType === KeyTypes.RelationshipElement) {
            entryNode?.statements?.push(smElements[i]);
            smElements.splice(i, 1);
        }
    }
    smElements.push(entryNode as Entity);
}

function isBulkCountProperty(el: ISubmodelElement) {
    return el.semanticId?.keys[0]?.value === SubmodelElementSemanticId.BulkCount;
}
