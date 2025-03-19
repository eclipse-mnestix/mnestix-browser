import { IntlMessages } from 'i18n/messages';

type Paths<Schema, Path extends string = ''> = Schema extends string
    ? Path
    : Schema extends object
      ? {
            [K in keyof Schema & string]: Paths<Schema[K], `${Path}${Path extends '' ? '' : '.'}${K}`>;
        }[keyof Schema & string]
      : never;

export class LocalizedError extends Error {
    descriptor: Paths<IntlMessages>;

    constructor(message: Paths<IntlMessages>) {
        const trueProto = new.target.prototype;
        super();
        Object.setPrototypeOf(this, trueProto);
        this.descriptor = message;
    }
}
