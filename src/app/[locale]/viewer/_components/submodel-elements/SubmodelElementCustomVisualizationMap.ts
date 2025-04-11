import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
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
    [SubmodelElementSemanticIdEnum.Address]: AddressComponent,
    [SubmodelElementSemanticIdEnum.NameplateAddressV3]: AddressComponent,
    [SubmodelElementSemanticIdEnum.ContactInformation]: ContactInformationComponent,
    [SubmodelElementSemanticIdEnum.MarkingsV1]: MarkingsComponent,
    [SubmodelElementSemanticIdEnum.MarkingsV2]: MarkingsComponent,
    [SubmodelElementSemanticIdEnum.MarkingsV3]: MarkingsComponent,
    [SubmodelElementSemanticIdEnum.MarkingsIrdiV1]: MarkingsComponent,
    [SubmodelElementSemanticIdEnum.MarkingsIrdiV3]: MarkingsComponent,
    [SubmodelElementSemanticIdEnum.Document]: DocumentComponent,
    [SubmodelElementSemanticIdEnum.DocumentIrdi]: DocumentComponent,
};
