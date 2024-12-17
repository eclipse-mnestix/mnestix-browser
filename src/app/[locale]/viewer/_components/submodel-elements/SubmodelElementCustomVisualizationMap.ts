import { SubmodelElementSemanticId } from 'lib/enums/SubmodelElementSemanticId.enum';
import { ContactInformationComponent } from './contact-information-component/ContactInformationComponent';
import { MarkingsComponent } from './marking-components/MarkingsComponent';
import { AddressComponent } from './address-component/AddressComponent';
import { DocumentComponent } from './document-component/DocumentComponent';

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
