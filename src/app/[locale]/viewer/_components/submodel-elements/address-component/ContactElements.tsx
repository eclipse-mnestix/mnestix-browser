import { Box, Link, Typography } from '@mui/material';
import { findValueByIdShort, getTranslationValue } from 'lib/util/SubmodelResolverUtil';
import { useLocale, useTranslations } from 'next-intl';
import { getMailToHref, getSanitizedHref, getTelHref } from 'lib/util/HrefUtil';
import { IDataElement, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import enMessages from 'locale/en.json';
import { GenericSubmodelElementComponent } from '../generic-elements/GenericSubmodelElementComponent';
import { SubModelElementCollectionContactInfo } from 'lib/util/ApiExtensions/ExtendISubmodelElement';
import { SubmodelElementChoice } from 'lib/api/aas/models';

type AddressType = keyof typeof enMessages.components.addressComponent.addressTypes;

function getAddressType(type: string, translation: (type: AddressType) => string) {
    if (type in enMessages.components.addressComponent.addressTypes) {
        return translation(type as AddressType);
    }
    return null;
}

type ContactType = keyof typeof enMessages.components.contactInformation.contactTypes;

function getContactType(type: string, translation: (type: ContactType) => string) {
    if (type in enMessages.components.addressComponent.addressTypes) {
        return translation(type as ContactType);
    }
    return null;
}

// Build Address part
export function AddressElement({ el, index }: { el: IDataElement; index?: number }) {
    const addressTypes = useTranslations('components.addressComponent.addressTypes');
    const locale = useLocale();

    const actualAddress = getTranslationValue(el, locale);
    const addressType = el.idShort ? (getAddressType(el.idShort, addressTypes) ?? el.idShort) : '';

    return (
        <Box key={index} sx={{ display: 'flex' }}>
            <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                {addressType}
            </Typography>
            <Typography>{actualAddress}</Typography>
        </Box>
    );
}

// Build Phone number part
export function PhoneElement({ el, index }: { el: SubmodelElementCollection; index?: number }) {
    const contactTypes = useTranslations('components.contactInformation.contactTypes');
    const locale = useLocale();

    if (!el.value) {
        return null;
    }

    const actualNumber = findValueByIdShort(el.value, 'TelephoneNumber', null, locale);
    const typeOfNumber = findValueByIdShort(el.value, 'TypeOfTelephone', null, locale);
    const addressType = typeOfNumber ? getContactType(typeOfNumber, contactTypes) : '';

    return (
        <Box key={index} sx={{ display: 'flex' }}>
            {addressType && (
                <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                    {addressType}
                </Typography>
            )}
            {actualNumber && (
                <Link href={getTelHref(actualNumber)} target="_blank" rel="noreferrer">
                    <Typography>{actualNumber}</Typography>
                </Link>
            )}
        </Box>
    );
}

// Build Fax part
export function FaxElement({ el, index }: { el: SubmodelElementCollection; index?: number }) {
    const contactTypes = useTranslations('components.contactInformation.contactTypes');
    const locale = useLocale();

    if (!el.value) {
        return null;
    }

    const actualNumber = findValueByIdShort(el.value, 'FaxNumber', null, locale);
    const typeOfNumber = findValueByIdShort(el.value, 'TypeOfFaxNumber', null, locale);
    const addressType = typeOfNumber ? getContactType(typeOfNumber, contactTypes) : '';

    return (
        <Box key={index} sx={{ display: 'flex' }}>
            {addressType && (
                <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                    {addressType}
                </Typography>
            )}
            {actualNumber && <Typography>{actualNumber}</Typography>}
        </Box>
    );
}

// Build Mail part
export function EmailElement({ el, index }: { el: SubmodelElementCollection; index?: number }) {
    const contactTypes = useTranslations('components.contactInformation.contactTypes');
    const locale = useLocale();

    if (!el.value) {
        return null;
    }

    const actualAddress = findValueByIdShort(el.value, 'EmailAddress', null, locale);
    const typeOfEmail = findValueByIdShort(el.value, 'TypeOfEmailAddress', null, locale);
    const addressType = typeOfEmail ? getContactType(typeOfEmail, contactTypes) : '';

    return (
        <Box key={index} sx={{ display: 'flex' }}>
            {addressType && (
                <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                    {addressType}
                </Typography>
            )}
            {actualAddress && (
                <Link href={getMailToHref(actualAddress)} target="_blank" rel="noreferrer">
                    <Typography>{actualAddress}</Typography>
                </Link>
            )}
        </Box>
    );
}

export function IpElement({ el, index }: { el: SubmodelElementCollection; index?: number }) {
    return (
        <Box key={index} sx={{ display: 'flex' }}>
            <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                {el.idShort}
            </Typography>
            <GenericSubmodelElementComponent
                submodelElement={el as unknown as SubmodelElementChoice}
                wrapInDataRow={false}
            />
        </Box>
    );
}

export function PersonElement({ el, index }: { el: SubModelElementCollectionContactInfo; index?: number }) {
    return (
        <Box key={index} sx={{ display: 'flex' }}>
            <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                {el.idShort}
            </Typography>
            <GenericSubmodelElementComponent
                submodelElement={el as unknown as SubmodelElementChoice}
                wrapInDataRow={false}
            />
        </Box>
    );
}

export function VatElement({ el, index }: { el: IDataElement; index?: number }) {
    const t = useTranslations('components.addressComponent');
    const locale = useLocale();

    const VATNumber = getTranslationValue(el, locale);

    return (
        <Box key={index} sx={{ display: 'flex' }}>
            <Typography color="text.secondary" sx={{ minWidth: '190px', mr: '5px' }}>
                {t('VAT')}
            </Typography>
            <Typography>{VATNumber}</Typography>
        </Box>
    );
}

export function LinkElement({ el, index }: { el: IDataElement; index?: number }) {
    const locale = useLocale();

    const linkAddress = getTranslationValue(el, locale);

    return (
        <Box key={index} sx={{ display: 'flex' }}>
            <Link href={getSanitizedHref(linkAddress)} target="_blank" rel="noreferrer">
                <Typography>{linkAddress}</Typography>
            </Link>
        </Box>
    );
}
