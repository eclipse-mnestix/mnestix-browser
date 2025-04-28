import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { CarbonFootprintDetail } from './carbon-footprint/CarbonFootprintDetail';
import { BillOfApplicationsDetail } from './bill-of-applications/BillOfApplicationsDetail';
import { ReferenceCounterDetail } from './reference-counter/ReferenceCounterDetail';
import { HierarchicalStructuresDetail } from './hierarchical-structures/HierarchicalStructuresDetail';
import { TimeSeriesDetail } from './time-series/TimeSeriesDetail';
import { TechnicalDataDetail } from 'app/[locale]/viewer/_components/submodel/technical-data/TechnicalDataDetail';

/**
 * This represents the mapping between the submodel and the submodel visualization. If you want to create a new custom
 * submodel visualization, add it here. A detailed description on how to create custom submodel visualizations can be
 * found here: https://github.com/eclipse-mnestix/mnestix-browser/wiki/How-to-create-custom-submodel-visualizations
 */
export const submodelCustomVisualizationMap = {
    [SubmodelSemanticIdEnum.CarbonFootprint]: CarbonFootprintDetail,
    [SubmodelSemanticIdEnum.CarbonFootprintV1]: CarbonFootprintDetail,
    [SubmodelSemanticIdEnum.CarbonFootprintIrdi]: CarbonFootprintDetail,
    [SubmodelSemanticIdEnum.ReferenceCounterContainer]: ReferenceCounterDetail,
    [SubmodelSemanticIdEnum.TimeSeries]: TimeSeriesDetail,
    [SubmodelSemanticIdEnum.HierarchicalStructuresV10]: HierarchicalStructuresDetail,
    [SubmodelSemanticIdEnum.HierarchicalStructuresV11]: HierarchicalStructuresDetail,
    [SubmodelSemanticIdEnum.BillOfApplications]: BillOfApplicationsDetail,
    [SubmodelSemanticIdEnum.TechnicalDataV11]: TechnicalDataDetail,
    [SubmodelSemanticIdEnum.TechnicalDataV12]: TechnicalDataDetail
};
