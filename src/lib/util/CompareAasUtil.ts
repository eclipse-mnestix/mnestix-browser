import { SubmodelElementChoice, KeyTypes, Submodel, SubmodelElementCollection } from 'lib/api/aas/models';
import { SubmodelCompareData, SubmodelCompareDataRecord } from 'lib/types/SubmodelCompareData';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';

export function generateSubmodelCompareData(sm: Submodel | SubmodelElementCollection): SubmodelCompareData {
    const semanticId = sm.semanticId?.keys?.[0]?.value ?? null;
    const idShort = sm.idShort ?? null;
    let dataRecords = null;
    const elementType = sm.modelType;
    if (elementType === KeyTypes.SubmodelElementCollection) {
        const submodelElementCollection = sm;
        if (submodelElementCollection.value) dataRecords = getSubmodelElementsValues(submodelElementCollection.value);
    } else {
        if (sm.submodelElements) dataRecords = getSubmodelElementsValues(sm.submodelElements);
    }
    return { semanticId: semanticId, idShort: idShort, dataRecords: dataRecords };
}

export function isCompareData(
    compareData?: SubmodelCompareData | SubmodelCompareDataRecord,
): compareData is SubmodelCompareData {
    return compareData !== undefined && 'dataRecords' in compareData;
}

export function isCompareDataRecord(
    compareRecord?: SubmodelCompareDataRecord | SubmodelCompareData,
): compareRecord is SubmodelCompareDataRecord {
    return compareRecord !== undefined && 'submodelElements' in compareRecord;
}

export function compareRowValues(smElements: (SubmodelElementChoice | null)[], locale: string) {
    const marked: number[] = [];
    const values: (string | null)[] = [];

    const valuesLength = smElements.length;
    smElements.forEach((el) => {
        if (!el) values.push(null);
        if (el) {
            const submodelElementType = el.modelType;
            switch (submodelElementType) {
                case KeyTypes.Property:
                    values.push(el.value ?? null);
                    break;
                case KeyTypes.MultiLanguageProperty:
                    values.push(getTranslationText(el, locale));
                    break;
            }
        }
    });

    if (valuesLength == 2 && values[0] !== values[1]) {
        if (values[1] !== null) {
            marked.push(1);
        } else {
            marked.push(0);
        }
    }

    if (valuesLength == 3) {
        if (values[0] !== values[2] && values[0] !== values[1] && values[1] !== values[2]) {
            marked.push(...[0, 1, 2]);
        } else {
            const diffIndex = values.findIndex((value, index) => {
                const nextIndex = (index + 1) % valuesLength;
                const prevIndex = (index + valuesLength - 1) % valuesLength;
                const next = values[nextIndex];
                const prev = values[prevIndex];
                return value !== next && value !== prev;
            });
            marked.push(diffIndex);
        }
    }

    return marked;
}

function getSubmodelElementsValues(
    sm: SubmodelElementChoice[],
): (SubmodelCompareDataRecord | SubmodelCompareData)[] | null {
    if (!sm) return null;
    const submodelCompareDataRecords: (SubmodelCompareDataRecord | SubmodelCompareData)[] = [];

    sm.forEach((el) => {
        const submodelElementType = el.modelType;
        if (submodelElementType === KeyTypes.SubmodelElementCollection) {
            const elementCollection = el;
            if (elementCollection.value != null) {
                const submodelRecords = generateSubmodelCompareData(elementCollection);
                submodelCompareDataRecords.push(submodelRecords);
                return;
            }
        }
        const semanticId = el.semanticId?.keys?.[0]?.value ?? null;
        const idShort = el.idShort ?? null;
        submodelCompareDataRecords.push({
            semanticId: semanticId,
            idShort: idShort,
            submodelElements: [el],
        });
    });

    return submodelCompareDataRecords;
}
