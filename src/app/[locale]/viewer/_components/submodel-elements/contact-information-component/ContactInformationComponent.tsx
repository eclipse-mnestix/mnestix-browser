import { Box, Link, Typography } from '@mui/material';
import { DataRow } from 'components/basics/DataRow';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { FormattedMessage, useIntl } from 'react-intl';
import { DialerSip, Mail, Person, Phone, Place, Print, Public } from '@mui/icons-material';
import { messages } from 'lib/i18n/localization';
import { getMailToHref, getSanitizedHref, getTelHref } from 'lib/util/HrefUtil';
import { AddressGroupWithIcon } from '../address-component/AddressGroupWithIcon';
import {
    MultiLanguageProperty,
    Property,
    ISubmodelElement,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { GenericSubmodelElementComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { SubModelElementCollectionContactInfo } from 'lib/util/ApiExtensions/ExtendISubmodelElement';

type ContactInformationComponentProps = {
    readonly submodelElement?: SubmodelElementCollection;
    readonly hasDivider?: boolean;
    readonly submodelId?: string;
};

type NameplateAddressTypes = keyof typeof messages.mnestix.nameplateAddressTypes;
function parseAddressType(el: SubmodelElementCollection, key: string): NameplateAddressTypes | null {
    return (
        el &&
        el.value &&
        ((Object.values(el.value).find((obj) => obj.idShort === key) as Property | null)
            ?.value as NameplateAddressTypes | null)
    );
}

export function ContactInformationComponent(props: ContactInformationComponentProps) {
    const intl = useIntl();

    if (!props.submodelElement?.value) {
        return <></>;
    }

    const idShortsOfSubmodelElementsContainingPersonData: string[] = [
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
    const addressData: Array<ISubmodelElement> = Object.values(props.submodelElement.value) as Array<ISubmodelElement>;
    let addressOfAdditionalLink: Property | undefined;
    const personData: Array<SubmodelElementCollection> = [];
    const phone: Array<SubmodelElementCollection> = [];
    const fax: Array<SubmodelElementCollection> = [];
    const email: Array<SubmodelElementCollection> = [];
    const ipCommunicationData: Array<SubmodelElementCollection> = [];

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
            addressOfAdditionalLink = entry as Property;
            return false;
        }
        if (id !== null && idShortsOfSubmodelElementsContainingPersonData.includes(id)) {
            personData.push(entry as SubmodelElementCollection);
            return false;
        }
        if (id?.startsWith('IPCommunication')) {
            ipCommunicationData.push(entry as SubmodelElementCollection);
            return false;
        }
        return true;
    });

    const filteredPersonData: SubModelElementCollectionContactInfo[] = [];
    idShortsOfSubmodelElementsContainingPersonData.forEach((id) => {
        const contactInfo: SubModelElementCollectionContactInfo = personData.find(
            (item) => item.idShort === id,
        ) as SubModelElementCollectionContactInfo;

        if (contactInfo && contactInfo.value) {
            filteredPersonData.push(contactInfo);
        }
    });

    const sortedAddressData: SubmodelElementCollection[] = [];
    const idShortsOfSubmodelElementsContainingAddressData: string[] = [
        'Company',
        'Street',
        'Zipcode',
        'CityTown',
        'StateCounty',
        'NationalCode',
        'TimeZone',
        'POBox',
        'ZipCodeOfPOBox',
    ];

    idShortsOfSubmodelElementsContainingAddressData.forEach((id) => {
        const addressInfo = filteredAddressData.find((item) => item.idShort === id);
        if (addressInfo) {
            sortedAddressData.push(addressInfo as SubmodelElementCollection);
        }
    });

    // Build person part
    const person = filteredPersonData.map((el, index) => {
        return (
            <Box key={index} sx={{ display: 'flex' }}>
                <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                    {el.idShort}
                </Typography>
                <GenericSubmodelElementComponent submodelElement={el} wrapInDataRow={false} />
            </Box>
        );
    });
    // Build Address part with filtered attributes
    const locationAddress = sortedAddressData.map((el, index) => {
        return (
            <Box key={index} sx={{ display: 'flex' }}>
                <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                    {el.idShort}
                </Typography>
                <GenericSubmodelElementComponent submodelElement={el} wrapInDataRow={false} />
            </Box>
        );
    });
    // Build Phone numbers part
    const phoneNumbers = phone.map((el, index) => {
        const actualNumber: MultiLanguageProperty | null =
            el &&
            el.value &&
            (Object.values(el.value).find((obj) => obj.idShort === 'TelephoneNumber') as MultiLanguageProperty);
        const typeOfNumber = parseAddressType(el, 'TypeOfTelephone');

        return (
            <Box key={index} sx={{ display: 'flex' }}>
                {typeOfNumber && (
                    <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                        {typeOfNumber && messages.mnestix.nameplateAddressTypes[typeOfNumber] && (
                            <FormattedMessage {...messages.mnestix.nameplateAddressTypes[typeOfNumber]} />
                        )}
                    </Typography>
                )}
                {actualNumber && (
                    <Link href={getTelHref(getTranslationText(actualNumber, intl))} target="_blank" rel="noreferrer">
                        <Typography>{getTranslationText(actualNumber, intl)}</Typography>
                    </Link>
                )}
            </Box>
        );
    });

    // Build Fax part
    const faxNumbers = fax.map((el, index) => {
        const actualNumber: MultiLanguageProperty | null =
            el &&
            el.value &&
            (Object.values(el.value).find((obj) => obj.idShort === 'FaxNumber') as MultiLanguageProperty);
        const typeOfNumber = parseAddressType(el, 'TypeOfFaxNumber');

        return (
            <Box key={index} sx={{ display: 'flex' }}>
                {typeOfNumber && (
                    <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                        {!!typeOfNumber && !!messages.mnestix.nameplateAddressTypes[typeOfNumber] && (
                            <FormattedMessage {...messages.mnestix.nameplateAddressTypes[typeOfNumber]} />
                        )}
                    </Typography>
                )}
                {actualNumber && <Typography>{getTranslationText(actualNumber, intl)}</Typography>}
            </Box>
        );
    });

    // Build Mail part
    const emailAddresses = email.map((el, index) => {
        const actualAddress: Property | null =
            el && el.value && (Object.values(el.value).find((obj) => obj.idShort === 'EmailAddress') as Property);
        const typeOfEmail = parseAddressType(el, 'TypeOfEmailAddress');

        return (
            <Box key={index} sx={{ display: 'flex' }}>
                {typeOfEmail && (
                    <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                        {typeOfEmail && messages.mnestix.nameplateAddressTypes[typeOfEmail] && (
                            <FormattedMessage {...messages.mnestix.nameplateAddressTypes[typeOfEmail]} />
                        )}
                    </Typography>
                )}
                {actualAddress && (
                    <Link href={getMailToHref(actualAddress.value?.toString())} target="_blank" rel="noreferrer">
                        <Typography>{actualAddress.value?.toString()}</Typography>
                    </Link>
                )}
            </Box>
        );
    });

    const ipCommunication = ipCommunicationData.map((el, index) => {
        return (
            <Box key={index} sx={{ display: 'flex' }}>
                <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                    {el.idShort}
                </Typography>
                <GenericSubmodelElementComponent submodelElement={el} wrapInDataRow={false} />
            </Box>
        );
    });
    // render all
    return (
        <DataRow title={props.submodelElement.idShort} hasDivider={props.hasDivider}>
            {person && person.length > 0 && (
                <AddressGroupWithIcon icon={<Person color="primary" fontSize="small" />} sx={{ mt: 1 }}>
                    {person}
                </AddressGroupWithIcon>
            )}
            {locationAddress && locationAddress.length > 0 && (
                <AddressGroupWithIcon icon={<Place color="primary" fontSize="small" />} sx={{ mt: 1 }}>
                    {locationAddress}
                </AddressGroupWithIcon>
            )}
            {phone && phone.length > 0 && (
                <AddressGroupWithIcon icon={<Phone color="primary" fontSize="small" />}>
                    {phoneNumbers}
                </AddressGroupWithIcon>
            )}
            {fax && fax.length > 0 && (
                <AddressGroupWithIcon icon={<Print color="primary" fontSize="small" />}>
                    {faxNumbers}
                </AddressGroupWithIcon>
            )}
            {email && email.length > 0 && (
                <AddressGroupWithIcon icon={<Mail color="primary" fontSize="small" />}>
                    {emailAddresses}
                </AddressGroupWithIcon>
            )}
            {ipCommunication && ipCommunication.length > 0 && (
                <AddressGroupWithIcon icon={<DialerSip color="primary" fontSize="small" />} sx={{ mt: 1 }}>
                    {ipCommunication}
                </AddressGroupWithIcon>
            )}
            {addressOfAdditionalLink && (
                <AddressGroupWithIcon icon={<Public color="primary" fontSize="small" />}>
                    <Link
                        href={getSanitizedHref(addressOfAdditionalLink.value?.toString())}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Typography>{addressOfAdditionalLink.value?.toString()}</Typography>
                    </Link>
                </AddressGroupWithIcon>
            )}
        </DataRow>
    );
}
