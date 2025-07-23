import { EntityType } from 'lib/api/aas/models';

// TODO replace any - used to be class but that doesn't exist in the generated types
export function GetEntityType(el: any): EntityType | null {
    try {
        const jsonable = JSON.parse(JSON.stringify(el));

        switch (jsonable.entityType) {
            case 'SelfManagedEntity':
                return EntityType.SelfManagedEntity;
            default:
                return EntityType.CoManagedEntity;
        }
    } catch {
        return null;
    }
}
