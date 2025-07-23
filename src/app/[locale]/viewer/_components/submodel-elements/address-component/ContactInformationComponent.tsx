import { DataRow } from 'components/basics/DataRow';
import { DialerSip, Mail, Person, Phone, Place, Print, Public } from '@mui/icons-material';
import { AddressGroupWithIcon } from './AddressGroupWithIcon';
import {
    DataElementChoice,
    SubmodelElementChoice,
    SubmodelElementCollection,
} from 'lib/api/aas/models';
import { SubModelElementCollectionContactInfo } from 'lib/util/ApiExtensions/ExtendISubmodelElement';
import {
    AddressElement,
    EmailElement,
    FaxElement,
    IpElement,
    LinkElement,
    PersonElement,
    PhoneElement,
} from './ContactElements';
import { idShortsOfSubmodelElementsContainingAddressData } from './AddressComponent';
import { CustomSubmodelElementComponentProps } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';

export const idShortsOfSubmodelElementsContainingPersonData: string[] = [
    'NameOfContact',
    'FirstName',
    'MiddleNames',
    'Title',
    'AcademicTitle',
    'RoleOfContactPerson',
    'Department',
    'Language',
    'FurtherDetailsOfContact',
];

export function ContactInformationComponent(props: CustomSubmodelElementComponentProps) {
    if (!props.submodelElement?.value) {
        return <></>;
    }

    const addressData: Array<SubmodelElementChoice> = Object.values(props.submodelElement.value) as Array<SubmodelElementChoice>;
    const additionalLink: Array<DataElementChoice> = [];
    const personData: Array<SubmodelElementCollection> = [];
    const phone: Array<SubmodelElementCollection> = [];
    const fax: Array<SubmodelElementCollection> = [];
    const email: Array<SubmodelElementCollection> = [];
    const ipCommunication: Array<SubmodelElementCollection> = [];

    // Filter out special address attributes and assign them to variables
    const filteredAddressData = addressData.filter((entry) => {
        const id = entry.idShort;
        if (id?.startsWith('Phone')) {
            phone.push(entry as SubmodelElementCollection);
            return false;
        }
        if (id?.startsWith('Fax')) {
            fax.push(entry as SubmodelElementCollection);
            return false;
        }
        if (id?.startsWith('Email')) {
            email.push(entry as SubmodelElementCollection);
            return false;
        }
        if (id === 'AddressOfAdditionalLink') {
            additionalLink.push(entry as DataElementChoice);
            return false;
        }
        if (id?.startsWith('IPCommunication')) {
            ipCommunication.push(entry as SubmodelElementCollection);
            return false;
        }
        if (id && idShortsOfSubmodelElementsContainingPersonData.includes(id)) {
            personData.push(entry as SubmodelElementCollection);
            return false;
        }
        return true;
    });

    const sortedPerson = personData.toSorted((a, b) => {
        const indexA = idShortsOfSubmodelElementsContainingPersonData.indexOf(a.idShort || '');
        const indexB = idShortsOfSubmodelElementsContainingPersonData.indexOf(b.idShort || '');
        return (indexA === -1 ? 1000 : indexA) - (indexB === -1 ? 1000 : indexB);
    });

    const sortedAddress = filteredAddressData.toSorted((a, b) => {
        const indexA = idShortsOfSubmodelElementsContainingAddressData.indexOf(a.idShort || '');
        const indexB = idShortsOfSubmodelElementsContainingAddressData.indexOf(b.idShort || '');
        return (indexA === -1 ? 1000 : indexA) - (indexB === -1 ? 1000 : indexB);
    });

    // render all
    return (
        <DataRow title={props.submodelElement.idShort} hasDivider={props.hasDivider}>
            {sortedPerson.length > 0 && (
                <AddressGroupWithIcon icon={<Person color="primary" fontSize="small" />} sx={{ mt: 1 }}>
                    {sortedPerson.map((value) => (
                        <PersonElement el={value} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
            {sortedAddress.length > 0 && (
                <AddressGroupWithIcon icon={<Place color="primary" fontSize="small" />} sx={{ mt: 1 }}>
                    {sortedAddress.map((value) => (
                        <AddressElement el={value as DataElementChoice} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
            {phone.length > 0 && (
                <AddressGroupWithIcon icon={<Phone color="primary" fontSize="small" />}>
                    {phone.map((value) => (
                        <PhoneElement el={value} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
            {fax.length > 0 && (
                <AddressGroupWithIcon icon={<Print color="primary" fontSize="small" />}>
                    {fax.map((value) => (
                        <FaxElement el={value} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
            {email.length > 0 && (
                <AddressGroupWithIcon icon={<Mail color="primary" fontSize="small" />}>
                    {email.map((value) => (
                        <EmailElement el={value} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
            {ipCommunication.length > 0 && (
                <AddressGroupWithIcon icon={<DialerSip color="primary" fontSize="small" />} sx={{ mt: 1 }}>
                    {ipCommunication.map((value) => (
                        <IpElement el={value} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
            {additionalLink.length > 0 && (
                <AddressGroupWithIcon icon={<Public color="primary" fontSize="small" />}>
                    {additionalLink.map((value) => (
                        <LinkElement el={value} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
        </DataRow>
    );
}
