import { SubmodelElementChoice } from 'lib/api/aas/models';

export class SubmodelCompareData {
    semanticId: string | null;
    idShort: string | null;
    dataRecords: (SubmodelCompareDataRecord | SubmodelCompareData)[] | null;
}

export class SubmodelCompareDataRecord {
    semanticId: string | null;
    idShort: string | null;
    submodelElements: (SubmodelElementChoice | null)[];
}
