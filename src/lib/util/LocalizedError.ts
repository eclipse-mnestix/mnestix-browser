export class LocalizedError extends Error {
    descriptor: string;

    constructor(message: string) {
        const trueProto = new.target.prototype;
        super();
        Object.setPrototypeOf(this, trueProto);
        this.descriptor = message;
    }
}
