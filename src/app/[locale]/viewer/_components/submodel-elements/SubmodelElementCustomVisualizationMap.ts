import { SubmodelElementSemanticId } from 'lib/enums/SubmodelElementSemanticId.enum';
import { ContactInformationComponent } from './address-component/ContactInformationComponent';
import { MarkingsComponent } from './marking-components/MarkingsComponent';
import { AddressComponent } from './address-component/AddressComponent';
import { DocumentComponent } from './document-component/DocumentComponent';

/**
 * This represents the mapping between the submodel elements and the submodel element components to be shown.
 * If you want to create a new custom submodel visualization, add the respectve submodel elements here.
 * A detailed description on how to create custom submodel visualizations can be found here:
 * https://github.com/eclipse-mnestix/mnestix-browser/wiki/How-to-create-custom-submodel-visualizations
 */
export const submodelElementCustomVisualizationMap = {
    [SubmodelElementSemanticId.Address]: AddressComponent,
    [SubmodelElementSemanticId.ContactInformation]: ContactInformationComponent,
    [SubmodelElementSemanticId.MarkingsV1]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsV2]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsV3]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsIrdiV1]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsIrdiV3]: MarkingsComponent,
    [SubmodelElementSemanticId.Document]: DocumentComponent,
    [SubmodelElementSemanticId.DocumentIrdi]: DocumentComponent,
};
