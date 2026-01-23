import { TrackerEmitter, TrackerListener } from 'lib/util/tracker';

export class Log {
    private tracker: TrackerEmitter<unknown>;

    private constructor(private console: Console) {
        this.tracker = new TrackerEmitter();
    }

    static create() {
        return new Log(console);
    }

    static createNull() {
        return new Log(new NulledLog());
    }

    public log(message?: unknown, ...optionalParams: unknown[]): void {
        this.console.log(message, ...optionalParams);
        this.tracker.emit({ level: 'normal', message: message });
    }

    public warn(message?: unknown, ...optionalParams: unknown[]): void {
        this.console.log(message, ...optionalParams);
        this.tracker.emit({ level: 'warning', message: message });
    }

    public getTracker(): TrackerListener<unknown> {
        return this.tracker.getTracker();
    }
}

export interface LogEntry {
    level: string;
    message: string;
}

class NulledLog implements Console {
    private logs: LogEntry[] = [];

    constructor() {}

    assert(_value?: unknown, _message?: unknown, ..._optionalParams: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    clear(): void {
        throw new Error('Method not implemented.');
    }

    count(_label?: unknown): void {
        throw new Error('Method not implemented.');
    }

    countReset(_label?: unknown): void {
        throw new Error('Method not implemented.');
    }

    debug(_message?: unknown, ..._optionalParams: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    dir(_obj?: unknown, _options?: unknown): void {
        throw new Error('Method not implemented.');
    }

    dirxml(..._data: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    error(_message?: unknown, ..._optionalParams: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    group(..._label: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    groupCollapsed(..._label: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    groupEnd(): void {
        throw new Error('Method not implemented.');
    }

    info(_message?: unknown, ..._optionalParams: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    log(message?: unknown, ..._optionalParams: unknown[]): void {
        this.logs.push({ level: 'normal', message: JSON.stringify(message) });
    }

    table(_tabularData?: unknown, _properties?: unknown): void {
        throw new Error('Method not implemented.');
    }

    time(_label?: unknown): void {
        throw new Error('Method not implemented.');
    }

    timeEnd(_label?: unknown): void {
        throw new Error('Method not implemented.');
    }

    timeLog(_label?: unknown, ..._data: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    timeStamp(_label?: unknown): void {
        throw new Error('Method not implemented.');
    }

    trace(_message?: unknown, ..._optionalParams: unknown[]): void {
        throw new Error('Method not implemented.');
    }

    warn(message?: unknown, ..._optionalParams: unknown[]): void {
        this.logs.push({ level: 'warning', message: JSON.stringify(message) });
    }

    // There were errors in the type definitions for Console in @types/node,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Console: any;

    profile(_label?: string | undefined): void {
        throw new Error('Method not implemented.');
    }

    profileEnd(_label?: string | undefined): void {
        throw new Error('Method not implemented.');
    }
}
