import { SubmodelElementSemanticId } from 'lib/enums/SubmodelElementSemanticId.enum';
import { AddressComponent } from 'app/[locale]/viewer/_components/submodel-elements/address-component/AddressComponent';
import { ContactInformationComponent } from 'app/[locale]/viewer/_components/submodel-elements/address-component/ContactInformationComponent';
import { MarkingsComponent } from 'app/[locale]/viewer/_components/submodel-elements/marking-components/MarkingsComponent';
import { DocumentComponent } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentComponent';

/**
 * This represents the mapping between the submodel elements and the submodel element components to be shown.
 * If you want to create a new custom submodel visualization, add the respective submodel elements here.
 * A detailed description on how to create custom submodel visualizations can be found here:
 * https://github.com/eclipse-mnestix/mnestix-browser/wiki/How-to-create-custom-submodel-visualizations
 */
export const submodelElementCustomVisualizationMap = {
    [SubmodelElementSemanticId.Address]: AddressComponent,
    [SubmodelElementSemanticId.NameplateAddressV3]: AddressComponent,
    [SubmodelElementSemanticId.ContactInformation]: ContactInformationComponent,
    [SubmodelElementSemanticId.MarkingsV1]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsV2]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsV3]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsIrdiV1]: MarkingsComponent,
    [SubmodelElementSemanticId.MarkingsIrdiV3]: MarkingsComponent,
    [SubmodelElementSemanticId.Document]: DocumentComponent,
    [SubmodelElementSemanticId.DocumentIrdi]: DocumentComponent,
};
