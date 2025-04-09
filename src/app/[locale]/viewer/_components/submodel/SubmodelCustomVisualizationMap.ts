import { SubmodelSemanticId } from 'lib/enums/SubmodelSemanticId.enum';
import { CarbonFootprintDetail } from './carbon-footprint/CarbonFootprintDetail';
import { BillOfApplicationsDetail } from './bill-of-applications/BillOfApplicationsDetail';
import { ReferenceCounterDetail } from './reference-counter/ReferenceCounterDetail';
import { HierarchicalStructuresDetail } from './hierarchical-structures/HierarchicalStructuresDetail';
import { TimeSeriesDetail } from './time-series/TimeSeriesDetail';

/**
 * This represents the mapping between the submodel and the submodel visualization. If you want to create a new custom
 * submodel visualization, add it here. A detailed description on how to create custom submodel visualizations can be
 * found here: https://github.com/eclipse-mnestix/mnestix-browser/wiki/How-to-create-custom-submodel-visualizations
 */
export const submodelCustomVisualizationMap = {
    [SubmodelSemanticId.CarbonFootprint]: CarbonFootprintDetail,
    [SubmodelSemanticId.CarbonFootprintV1]: CarbonFootprintDetail,
    [SubmodelSemanticId.CarbonFootprintIrdi]: CarbonFootprintDetail,
    [SubmodelSemanticId.ReferenceCounterContainer]: ReferenceCounterDetail,
    [SubmodelSemanticId.TimeSeries]: TimeSeriesDetail,
    [SubmodelSemanticId.HierarchicalStructuresV10]: HierarchicalStructuresDetail,
    [SubmodelSemanticId.HierarchicalStructuresV11]: HierarchicalStructuresDetail,
    [SubmodelSemanticId.BillOfApplications]: BillOfApplicationsDetail,
};
