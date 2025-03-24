import { DataRow } from 'components/basics/DataRow';
import { DialerSip, Info, Mail, Phone, Place, Print, Public } from '@mui/icons-material';
import { AddressGroupWithIcon } from './AddressGroupWithIcon';
import {
    IDataElement,
    ISubmodelElement,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import {
    AddressElement,
    EmailElement,
    FaxElement,
    IpElement,
    LinkElement,
    PhoneElement,
    VatElement,
} from './ContactElements';

type AddressComponentProps = {
    readonly submodelElement?: SubmodelElementCollection;
    readonly hasDivider?: boolean;
};

export const idShortsOfSubmodelElementsContainingAddressData: string[] = [
    'Company',
    'Department',
    'Street',
    'Zipcode',
    'CityTown',
    'StateCounty',
    'NationalCode',
    'TimeZone',
    'POBox',
    'ZipCodeOfPOBox',
];

export function AddressComponent(props: AddressComponentProps) {
    if (!props.submodelElement?.value) {
        return <></>;
    }

    const addressData: Array<ISubmodelElement> = Object.values(props.submodelElement.value) as Array<ISubmodelElement>;
    const additionalLink: Array<IDataElement> = [];
    const vatNumber: Array<IDataElement> = [];
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
            additionalLink.push(entry as IDataElement);
            return false;
        }
        if (id === 'VATNumber') {
            vatNumber.push(entry as IDataElement);
            return false;
        }
        if (id?.startsWith('IPCommunication')) {
            ipCommunication.push(entry as SubmodelElementCollection);
            return false;
        }
        return true;
    });

    const sortedAddress = filteredAddressData.toSorted((a, b) => {
        const indexA = idShortsOfSubmodelElementsContainingAddressData.indexOf(a.idShort || '');
        const indexB = idShortsOfSubmodelElementsContainingAddressData.indexOf(b.idShort || '');
        return (indexA === -1 ? 1000 : indexA) - (indexB === -1 ? 1000 : indexB);
    });

    // render all
    return (
        <DataRow title={props.submodelElement.idShort} hasDivider={props.hasDivider}>
            {sortedAddress.length > 0 && (
                <AddressGroupWithIcon icon={<Place color="primary" fontSize="small" />} sx={{ mt: 1 }}>
                    {sortedAddress.map((value) => (
                        <AddressElement el={value as IDataElement} key={value.idShort} />
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
            {vatNumber.length > 0 && (
                <AddressGroupWithIcon icon={<Info color="primary" fontSize="small" />}>
                    {vatNumber.map((value) => (
                        <VatElement el={value} key={value.idShort} />
                    ))}
                </AddressGroupWithIcon>
            )}
        </DataRow>
    );
}
