import { EntityType } from 'lib/api/aas/models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
