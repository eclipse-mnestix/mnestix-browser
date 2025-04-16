import {
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    Submodel,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { SubmodelCompareData, SubmodelCompareDataRecord } from 'lib/types/SubmodelCompareData';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';

export function generateSubmodelCompareData(sm: Submodel | SubmodelElementCollection): SubmodelCompareData {
    const semanticId = sm.semanticId?.keys?.[0]?.value ?? null;
    const idShort = sm.idShort;
    let dataRecords = null;
    const elementType = getKeyType(sm);
    if (elementType === KeyTypes.SubmodelElementCollection) {
        const submodelElementCollection = sm as SubmodelElementCollection;
        if (submodelElementCollection.value) dataRecords = getSubmodelElementsValues(submodelElementCollection.value);
    } else {
        const submodel = sm as Submodel;
        if (submodel.submodelElements) dataRecords = getSubmodelElementsValues(submodel.submodelElements);
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

export function compareRowValues(smElements: (ISubmodelElement | null)[], locale: string) {
    const marked: number[] = [];
    const values: (string | null)[] = [];

    const valuesLength = smElements.length;
    smElements.forEach((el) => {
        if (!el) values.push(null);
        if (el) {
            const submodelElementType = getKeyType(el);
            switch (submodelElementType) {
                case KeyTypes.Property:
                    values.push((el as Property).value ?? null);
                    break;
                case KeyTypes.MultiLanguageProperty:
                    values.push(getTranslationText(el as MultiLanguageProperty, locale));
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

function getSubmodelElementsValues(sm: ISubmodelElement[]): (SubmodelCompareDataRecord | SubmodelCompareData)[] | null {
    if (!sm) return null;
    const submodelCompareDataRecords: (SubmodelCompareDataRecord | SubmodelCompareData)[] = [];

    sm.forEach((el) => {
        const submodelElementType = getKeyType(el);
        if (submodelElementType === KeyTypes.SubmodelElementCollection) {
            const elementCollection = el as SubmodelElementCollection;
            if (elementCollection.value != null) {
                const submodelRecords = generateSubmodelCompareData(elementCollection);
                submodelCompareDataRecords.push(submodelRecords);
                return;
            }
        }
        const semanticId = el.semanticId?.keys?.[0]?.value ?? null;
        const idShort = el.idShort;
        submodelCompareDataRecords.push({
            semanticId: semanticId,
            idShort: idShort,
            submodelElements: [el],
        });
    });

    return submodelCompareDataRecords;
}
