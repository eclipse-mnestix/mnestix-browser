export enum ConnectionTypeEnum {
    AAS_REPOSITORY = 'AAS_REPOSITORY',
    AAS_REGISTRY = 'AAS_REGISTRY',
    SUBMODEL_REPOSITORY = 'SUBMODEL_REPOSITORY',
}

export function getTypeAction(type: ConnectionTypeEnum): { id: string; typeName: string } {
    switch (type) {
        case ConnectionTypeEnum.AAS_REPOSITORY:
            return { id: '0', typeName: ConnectionTypeEnum.AAS_REPOSITORY };
        case ConnectionTypeEnum.AAS_REGISTRY:
            return { id: '1', typeName: ConnectionTypeEnum.AAS_REGISTRY };
        case ConnectionTypeEnum.SUBMODEL_REPOSITORY:
            return { id: '2', typeName: ConnectionTypeEnum.SUBMODEL_REPOSITORY };
        default:
            throw new Error(`ConnectionType '${type}' not implemented.`);
    }
}
