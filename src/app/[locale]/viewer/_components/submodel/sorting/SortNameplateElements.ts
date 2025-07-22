import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { NameplateSorting } from 'app/[locale]/viewer/_components/submodel/sorting/NameplateSorting';
import { SubmodelElementChoice, Submodel, SubmodelElementCollection, KeyTypes } from 'lib/api/aas/models';

export function SortNameplateElements(submodel: Submodel | SubmodelElementCollection | undefined) {
    if (!submodel) {
        return;
    }

    const key = submodel.semanticId?.keys?.[0]?.value;
    let submodels: SubmodelElementChoice[];
    if ('submodelElements' in submodel && submodel['submodelElements']) {
        submodels = submodel.submodelElements;
    } else {
        const collection = submodel as SubmodelElementCollection;
        submodels = collection.value as SubmodelElementChoice[];
    }

    if (!submodels) {
        return;
    }

    // Sorting
    const nameplateKeys = [
        SubmodelSemanticIdEnum.NameplateV1,
        SubmodelSemanticIdEnum.NameplateV2,
        SubmodelSemanticIdEnum.NameplateV3,
        SubmodelSemanticIdEnum.NameplateV4,
    ];
    if (nameplateKeys.includes(<SubmodelSemanticIdEnum>key)) {
        SortSubmodelElements(submodels, NameplateSorting);
    }

    // Recursive
    submodels.forEach((submodel) => {
        if (submodel.modelType == KeyTypes.SubmodelElementCollection) {
            SortNameplateElements(submodel as SubmodelElementCollection);
        }
    });
}

function SortSubmodelElements(submodels: SubmodelElementChoice[], idShortOrder: string[]) {
    submodels.sort((a, b) => {
        const aIndex = idShortOrder.indexOf(a.idShort as string);
        const bIndex = idShortOrder.indexOf(b.idShort as string);

        // If both idShorts are not present in idShortOrder, maintain the original order
        if (aIndex === -1 && bIndex === -1) {
            return 0;
        }
        // If a.idShort is not present in idShortOrder, move it to the end
        if (aIndex === -1) {
            return 1;
        }
        // If b.idShort is not present in idShortOrder, move it to the end
        if (bIndex === -1) {
            return -1;
        }

        return aIndex - bIndex;
    });
}
