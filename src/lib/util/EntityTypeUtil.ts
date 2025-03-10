import { Class, EntityType } from '@aas-core-works/aas-core3.0-typescript/types';

export function GetEntityType(el: Class): EntityType {
    try {
        const jsonable = JSON.parse(JSON.stringify(el));

        switch (jsonable.entityType) {
            case 'SelfManagedEntity':
                return EntityType.SelfManagedEntity;
            default:
                return EntityType.CoManagedEntity;
        }
    } catch {
        return NaN;
    }
}
