import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { AasData } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';

/**
 * Data structure for storing an AAS together with its submodels.
 */
type AasWithAasData = {
    aas: AssetAdministrationShell;
    aasData?: AasData;
    infrastructureName?: string;
};

/**
 * Store context for Asset Administration Shells (AAS) and their submodels.
 * The store has a limited capacity (default: 1, can be increased).
 */
export type AasStoreContextType = {
    addAasData: (aasData: AasWithAasData) => void;
    getAasData: (aasId: string) => AasWithAasData | undefined;
    capacity: number;
};

/**
 * Capacity is set to 1 so there is no caching at the moment.
 */
const DEFAULT_CAPACITY = 1;
const AasStoreContext = createContext<AasStoreContextType | undefined>(undefined);

/**
 * Minimal shared state for AAS data for preloading and (future) caching.
 */
export function useAasStore() {
    const ctx = useContext(AasStoreContext);
    if (!ctx) throw new Error('useAasStore must be used within an AasStoreProvider');
    return ctx;
}

/**
 * Provider for the AAS and Submodel store.
 * @param children React children
 */
export function AasStoreProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AasWithAasData[]>([]);
    const capacity = DEFAULT_CAPACITY;

    /**
     * Add a new AasData to the store. If capacity is reached, remove the oldest.
     * @param aasData The AasData to add
     */
    function addAasData(aasData: AasWithAasData) {
        setData((prev) => {
            // Remove existing entry with same aas.id if present
            const filtered = prev.filter((d) => d.aas.id !== aasData.aas.id);
            // Add new entry and trim to capacity
            const updated = [...filtered, aasData];
            return updated.length > capacity ? updated.slice(updated.length - capacity) : updated;
        });
    }

    /**
     * Get AasData by AAS id.
     * @param aasId The id of the AAS
     */
    function getAasData(aasId: string) {
        return data.find((d) => d.aas.id === aasId);
    }

    return <AasStoreContext.Provider value={{ addAasData, getAasData, capacity }}>{children}</AasStoreContext.Provider>;
}
