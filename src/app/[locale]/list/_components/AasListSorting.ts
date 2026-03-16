export const sortableColumns = ['manufacturer', 'productDesignation', 'assetId', 'aasId'] as const;

export type SortOrder = 'asc' | 'desc';
export type SortableColumn = (typeof sortableColumns)[number];

export type SortableAasListEntity = {
    aasId: string;
    assetId: string;
    manufacturerName?: string;
    productDesignation?: string;
};

function getSortableValue(entity: SortableAasListEntity, sortColumn: SortableColumn): string {
    switch (sortColumn) {
        case 'aasId':
            return entity.aasId;
        case 'assetId':
            return entity.assetId;
        case 'manufacturer':
            return entity.manufacturerName || '';
        case 'productDesignation':
            return entity.productDesignation || '';
    }
}

/**
 * Sorts enriched AAS list entries for the active table column and direction.
 */
export function sortAasList<T extends SortableAasListEntity>(
    entities: T[],
    sortColumn: SortableColumn | null,
    sortOrder: SortOrder,
): T[] {
    if (!sortColumn) {
        return entities;
    }

    return [...entities].sort((left, right) => {
        const comparison = getSortableValue(left, sortColumn).localeCompare(getSortableValue(right, sortColumn));
        return sortOrder === 'asc' ? comparison : -comparison;
    });
}
