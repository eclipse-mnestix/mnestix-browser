import { flatten } from 'flat';
import { Expand } from 'lib/types/Expand';
import { deMnestix } from './de.mnestix';
import { enMnestix } from './en.mnestix';
import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

// TODO: Read language from browser or language set by user from local storage
export const defaultLanguage = 'en';

const de = { mnestix: deMnestix };
const en = { mnestix: enMnestix };

export const translationLists: Record<string, Record<string, string>> = {
    // TODO MNES-1136 remove flat lib when removing react-intl
    de: flatten(de),
    en: flatten(en),
};

// TODO MNES-1136 Remove react-intl
/**
 * @deprecated Please use t() of useTranslations(... instead as shown in TimeSeriesVisualizations.tsx
 */
export const messages = getMessagesFromTranslations('', de);

export type MessageDescriptorWithId = MessageDescriptor & { readonly id: string };

export type Messages<TMessages> = Expand<{
    readonly [Message in keyof TMessages]: TMessages[Message] extends string
        ? MessageDescriptorWithId
        : Messages<TMessages[Message]>;
}>;

export type TranslatedMessage = MessageDescriptorWithId & {
    readonly values?: { [key: string]: ReactNode };
};

function getMessagesFromTranslations<TMessages extends Record<string, unknown>>(
    key: string,
    node: TMessages,
): Messages<TMessages> {
    if (typeof node === 'string') {
        // TODO: Understand what's happening here so we don't have to use any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { id: key } as any;
    } else {
        return Object.fromEntries(
            Object.entries(node).map(([subKey, value]) => [
                subKey,
                getMessagesFromTranslations(combineKey(key, subKey), value as Record<string, unknown>),
            ]),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any;
    }
}

function combineKey(key: string, subKey: string) {
    return key ? `${key}.${subKey}` : subKey;
}
